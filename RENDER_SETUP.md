# Configuración de Render para Backend

## Variables de Entorno Necesarias

Configura estas variables en Render Dashboard > Environment:

### 1. Firebase Credentials
```
FIREBASE_CREDENTIALS
```
**Valor:** Copia todo el contenido del archivo JSON de Service Account de Firebase como un string JSON.

**Cómo obtenerlo:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "un-mundo-de-color"
3. Ve a Project Settings (⚙️) > Service Accounts
4. Haz clic en "Generate new private key"
5. Descarga el archivo JSON
6. Abre el archivo y copia TODO su contenido
7. Pégalo en Render como valor de `FIREBASE_CREDENTIALS`

### 2. Firebase Database URL
```
FIREBASE_DATABASE_URL
```
**Valor:** `https://un-mundo-de-color-default-rtdb.firebaseio.com/`

### 3. Stripe Secret Key
```
STRIPE_SECRET_KEY
```
**Valor:** Tu clave secreta de Stripe (empieza con `sk_test_` para pruebas o `sk_live_` para producción)

**Cómo obtenerlo:**
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copia la "Secret key" (Reveal test key)

### 4. Stripe Webhook Secret
```
STRIPE_WEBHOOK_SECRET
```
**Valor:** El secreto del webhook (empieza con `whsec_`)

**Cómo obtenerlo:**
1. En Stripe Dashboard, ve a Developers > Webhooks
2. Crea un nuevo endpoint: `https://tu-app.onrender.com/stripe/webhook`
3. Selecciona estos eventos:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.canceled`
   - `checkout.session.async_payment_failed`
4. Copia el "Signing secret"

### 5. Frontend URL
```
FRONTEND_URL
```
**Valor:** La URL de tu frontend desplegado (ej: `https://tu-tienda.vercel.app`)

### 6. Puerto (Opcional)
```
PORT
```
**Valor:** `5000` (Render lo asigna automáticamente, pero puedes especificarlo)

### 7. Node Environment
```
NODE_ENV
```
**Valor:** `production`

## Configuración en Render

### 1. Crear Web Service
1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" > "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name:** `un-mundo-de-color-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** (dejar vacío o poner `.`)

### 2. Agregar Variables de Entorno
1. En la configuración del servicio, ve a "Environment"
2. Agrega cada variable de entorno una por una
3. **IMPORTANTE:** Para `FIREBASE_CREDENTIALS`, pega TODO el JSON como un string

### 3. Configurar Webhook de Stripe
1. Una vez desplegado, copia la URL de tu servicio (ej: `https://un-mundo-de-color-backend.onrender.com`)
2. Ve a Stripe Dashboard > Webhooks
3. Crea endpoint: `https://tu-url.onrender.com/stripe/webhook`
4. Selecciona los eventos mencionados arriba
5. Copia el "Signing secret" y agrégalo a Render como `STRIPE_WEBHOOK_SECRET`

## Verificación

Después de desplegar, verifica:
1. Health check: `https://tu-url.onrender.com/health` debe responder `{"status":"ok"}`
2. Revisa los logs en Render para verificar que no hay errores
3. Prueba crear un pedido desde el frontend

## Notas Importantes

- Render puede tardar unos minutos en iniciar el servicio si está inactivo (free tier)
- Los webhooks de Stripe requieren HTTPS, Render lo proporciona automáticamente
- Si cambias las variables de entorno, Render reiniciará el servicio automáticamente

