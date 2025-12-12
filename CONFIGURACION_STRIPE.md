# 🔑 Configuración de Stripe

## ✅ Clave Pública (Publishable Key) - Frontend

**PK de Prueba:**
```
pk_test_51SdakxLVUv4xsq77BSMOHjQe9Qto27Mf8Dx8KjhDsL8cYtjdnlr8SsbjHA1569ImhAPk1N9Qv0pr5jQ5xcwhuVqA00itkDGhG3
```

**Estado:** ✅ Configurada en `frontend/.env.local`

**Nota:** Actualmente el frontend no usa directamente esta clave porque el backend crea las sesiones de Stripe. Pero está disponible por si se necesita en el futuro.

---

## ⚠️ Clave Secreta (Secret Key) - Backend (Render)

**Necesitas obtener la SK de prueba:**

1. Ve a [Stripe Dashboard - API Keys](https://dashboard.stripe.com/test/apikeys)
2. Asegúrate de estar en modo **Test** (toggle en la esquina superior derecha)
3. En la sección **"Secret key"**, haz clic en **"Reveal test key"**
4. Copia la clave (empieza con `sk_test_...`)

**Una vez que tengas la SK, agrégalo en Render como:**
```
STRIPE_SECRET_KEY = sk_test_...
```

---

## 📋 Resumen de Configuración

### Frontend (Local)
- ✅ PK configurada en `frontend/.env.local`
- ⚠️ Cuando despliegues el frontend, actualiza `VITE_API_URL` con la URL de Render

### Backend (Render)
- ⚠️ **PENDIENTE:** Agregar `STRIPE_SECRET_KEY` en Render
- ⚠️ **PENDIENTE:** Configurar webhook de Stripe después del despliegue

---

## 🔄 Flujo de Pago con Stripe

1. Usuario hace clic en "Pagar con Tarjeta" en el frontend
2. Frontend llama al backend: `POST /create-checkout-session`
3. Backend crea sesión de Stripe usando `STRIPE_SECRET_KEY`
4. Backend devuelve URL de checkout
5. Frontend redirige al usuario a Stripe Checkout
6. Usuario completa el pago en Stripe
7. Stripe envía webhook al backend: `POST /stripe/webhook`
8. Backend actualiza el pedido en Firebase

---

## 🧪 Tarjetas de Prueba de Stripe

Para probar pagos, usa estas tarjetas:

**Tarjeta exitosa:**
- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura (ej: `12/25`)
- CVC: Cualquier 3 dígitos (ej: `123`)
- Código Postal: Cualquier 5 dígitos (ej: `12345`)

**Tarjeta rechazada:**
- Número: `4000 0000 0000 0002`

**Más tarjetas de prueba:** [Stripe Testing](https://stripe.com/docs/testing)

---

## 📝 Checklist

- [x] PK de prueba obtenida y configurada en frontend
- [ ] SK de prueba obtenida (necesitas obtenerla de Stripe Dashboard)
- [ ] SK configurada en Render como `STRIPE_SECRET_KEY`
- [ ] Backend desplegado en Render
- [ ] Webhook de Stripe configurado
- [ ] `STRIPE_WEBHOOK_SECRET` configurado en Render
- [ ] Frontend actualizado con URL de Render en `VITE_API_URL`

---

## 🔗 Enlaces Útiles

- [Stripe Dashboard (Test)](https://dashboard.stripe.com/test/apikeys)
- [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Stripe Documentation](https://stripe.com/docs)

