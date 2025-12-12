const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Inicializar Firebase Admin
try {
  if (!process.env.FIREBASE_CREDENTIALS) {
    throw new Error('FIREBASE_CREDENTIALS no está configurado');
  }
  
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  
  if (!serviceAccount.project_id) {
    throw new Error('FIREBASE_CREDENTIALS no es válido');
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://un-mundo-de-color-default-rtdb.firebaseio.com/'
  });
  console.log('Firebase Admin inicializado correctamente');
} catch (error) {
  console.error('Error al inicializar Firebase Admin:', error);
  console.error('Asegúrate de que FIREBASE_CREDENTIALS esté configurado correctamente en Render');
}

// Middlewares
app.use(helmet());
// CORS: Permitir múltiples orígenes para desarrollo
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});
app.use('/api/', limiter);

// Database reference
const db = admin.database();

// Endpoint para crear sesión de checkout de Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, orderId, userInfo } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }

    if (!orderId) {
      return res.status(400).json({ error: 'orderId requerido' });
    }

    // Crear line items para Stripe
    const lineItems = items.map(item => {
      // Filtrar imágenes: Stripe solo acepta URLs de máximo 2048 caracteres
      const validImages = (item.images || [])
        .filter(img => img && typeof img === 'string' && img.length <= 2048)
        .slice(0, 8); // Stripe permite máximo 8 imágenes por producto
      
      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.name,
            images: validImages.length > 0 ? validImages : undefined, // Solo incluir si hay imágenes válidas
          },
          unit_amount: Math.round(item.unitPrice * 100), // Convertir a centavos
        },
        quantity: item.quantity,
      };
    });

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel?order_id=${orderId}`,
      metadata: {
        orderId: orderId,
        userEmail: userInfo?.email || '',
        userId: req.body.userId || '',
      },
      customer_email: userInfo?.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error al crear sesión de checkout:', error);
    res.status(500).json({ error: 'Error al crear sesión de checkout', message: error.message });
  }
});

// Webhook de Stripe
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Error en webhook signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const orderRef = db.ref(`orders/${orderId}`);
          await orderRef.update({
            status: 'completed',
            sessionId: session.id,
            paymentIntentId: session.payment_intent,
            updatedAt: Date.now()
          });
          console.log(`Pedido ${orderId} marcado como completado`);
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        const expiredOrderId = expiredSession.metadata?.orderId;

        if (expiredOrderId) {
          const expiredOrderRef = db.ref(`orders/${expiredOrderId}`);
          const snapshot = await expiredOrderRef.once('value');
          const order = snapshot.val();

          // Solo eliminar si está pendiente
          if (order && order.status === 'pending') {
            await expiredOrderRef.remove();
            console.log(`Pedido ${expiredOrderId} eliminado por expiración`);
          }
        }
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object;
        // Manejar cancelación si es necesario
        console.log('Pago cancelado:', canceledPayment.id);
        break;

      case 'checkout.session.async_payment_failed':
        const failedSession = event.data.object;
        const failedOrderId = failedSession.metadata?.orderId;

        if (failedOrderId) {
          const failedOrderRef = db.ref(`orders/${failedOrderId}`);
          const snapshot = await failedOrderRef.once('value');
          const order = snapshot.val();

          // Eliminar pedido fallido
          if (order && order.status === 'pending') {
            await failedOrderRef.remove();
            console.log(`Pedido ${failedOrderId} eliminado por pago fallido`);
          }
        }
        break;

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    res.status(500).json({ error: 'Error al procesar webhook' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

