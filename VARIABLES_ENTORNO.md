# Variables de Entorno para Render

## Variables Necesarias para el Backend

Copia estas variables y sus valores en Render Dashboard > Environment:

### 1. FIREBASE_CREDENTIALS
```
FIREBASE_CREDENTIALS
```
**Tipo:** String JSON

**Cómo obtener:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Proyecto: `un-mundo-de-color`
3. ⚙️ Project Settings > Service Accounts
4. Click "Generate new private key"
5. Descarga el JSON
6. Abre el archivo y copia TODO el contenido
7. Pégalo en Render (debe ser un string JSON válido)

**Ejemplo de formato:**
```json
{"type":"service_account","project_id":"un-mundo-de-color","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

### 2. FIREBASE_DATABASE_URL
```
FIREBASE_DATABASE_URL
```
**Valor:** `https://un-mundo-de-color-default-rtdb.firebaseio.com/`

### 3. STRIPE_SECRET_KEY
```
STRIPE_SECRET_KEY
```
**Valor:** Tu clave secreta de Stripe

**Cómo obtener:**
1. [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copia "Secret key" (Reveal test key para pruebas)
3. Formato: `sk_test_...` o `sk_live_...`

### 4. STRIPE_WEBHOOK_SECRET
```
STRIPE_WEBHOOK_SECRET
```
**Valor:** El secreto del webhook de Stripe

**Cómo obtener:**
1. Despliega primero el backend en Render
2. Copia la URL: `https://tu-app.onrender.com`
3. Ve a Stripe Dashboard > Developers > Webhooks
4. Crea endpoint: `https://tu-app.onrender.com/stripe/webhook`
5. Selecciona eventos:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.canceled`
   - `checkout.session.async_payment_failed`
6. Copia "Signing secret" (formato: `whsec_...`)

### 5. FRONTEND_URL
```
FRONTEND_URL
```
**Valor:** URL de tu frontend desplegado

**Ejemplos:**
- Desarrollo: `http://localhost:5173`
- Producción: `https://tu-tienda.vercel.app` o `https://tu-tienda.netlify.app`

### 6. PORT (Opcional)
```
PORT
```
**Valor:** `5000` (Render lo asigna automáticamente)

### 7. NODE_ENV
```
NODE_ENV
```
**Valor:** `production`

## Checklist para Render

- [ ] Repositorio conectado a GitHub
- [ ] Build Command: `cd backend && npm install`
- [ ] Start Command: `cd backend && npm start`
- [ ] Todas las variables de entorno configuradas
- [ ] Webhook de Stripe configurado con la URL de Render
- [ ] Health check funciona: `https://tu-url.onrender.com/health`

## Verificación

Después de configurar todo:
1. Revisa los logs en Render
2. Prueba el endpoint: `curl https://tu-url.onrender.com/health`
3. Debe responder: `{"status":"ok","timestamp":"..."}`

