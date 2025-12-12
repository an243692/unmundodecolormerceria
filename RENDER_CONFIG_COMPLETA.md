# Configuración Completa de Render para Backend

## Paso 1: Subir Código a GitHub

Si aún no has subido el código, ejecuta el script:
```powershell
.\SUBIR_GITHUB.ps1
```

O manualmente:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/unmundodecolormeceria/tienda-online.git
git branch -M main
git push -u origin main
```

## Paso 2: Crear Web Service en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Haz clic en **"New +"** > **"Web Service"**
3. Conecta tu repositorio de GitHub: `unmundodecolormeceria/tienda-online`
4. Configura el servicio:
   - **Name:** `un-mundo-de-color-backend`
   - **Environment:** `Node`
   - **Region:** Elige la más cercana (US East, US West, etc.)
   - **Branch:** `main`
   - **Root Directory:** `backend` (IMPORTANTE: solo el directorio backend)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (o el plan que prefieras)

## Paso 3: Configurar Variables de Entorno en Render

Ve a **Environment** en la configuración de tu servicio y agrega estas variables:

### 🔥 Firebase Credentials
```
FIREBASE_CREDENTIALS
```
**Valor:** Copia TODO el contenido del archivo JSON de Service Account de Firebase.

**Cómo obtenerlo:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a ⚙️ **Project Settings** > **Service Accounts**
4. Haz clic en **"Generate new private key"**
5. Descarga el archivo JSON
6. Abre el archivo y copia TODO su contenido (incluyendo las llaves `{}`)
7. Pégalo en Render como valor de `FIREBASE_CREDENTIALS`

**Ejemplo del formato:**
```json
{
  "type": "service_account",
  "project_id": "un-mundo-de-color",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  ...
}
```

### 🔥 Firebase Database URL
```
FIREBASE_DATABASE_URL
```
**Valor:** `https://un-mundo-de-color-default-rtdb.firebaseio.com/`

(O la URL de tu Realtime Database. La encuentras en Firebase Console > Realtime Database > Data)

### 💳 Stripe Secret Key (Prueba)
```
STRIPE_SECRET_KEY
```
**Valor:** Tu clave secreta de prueba de Stripe (empieza con `sk_test_`)

**Cómo obtenerla:**
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Asegúrate de estar en modo **Test** (toggle en la esquina superior derecha)
3. En **Secret key**, haz clic en **"Reveal test key"**
4. Copia la clave (empieza con `sk_test_...`)

### 🔐 Stripe Webhook Secret
```
STRIPE_WEBHOOK_SECRET
```
**Valor:** Se obtiene después de crear el webhook (ver Paso 4)

**IMPORTANTE:** Esta variable se configura DESPUÉS de desplegar el servicio.

### 🌐 Frontend URL
```
FRONTEND_URL
```
**Valor:** La URL donde está desplegado tu frontend.

- Si usas Vercel: `https://tu-proyecto.vercel.app`
- Si usas Netlify: `https://tu-proyecto.netlify.app`
- Si usas Firebase Hosting: `https://tu-proyecto.web.app`
- Si estás en desarrollo local: `http://localhost:5173` (o el puerto de Vite)

### ⚙️ Node Environment
```
NODE_ENV
```
**Valor:** `production`

### 🔌 Puerto (Opcional)
```
PORT
```
**Valor:** Render lo asigna automáticamente, pero puedes dejarlo vacío o poner `5000`

## Paso 4: Configurar Webhook de Stripe

**IMPORTANTE:** Haz esto DESPUÉS de que Render haya desplegado tu servicio.

1. Espera a que Render termine el despliegue
2. Copia la URL de tu servicio (ej: `https://un-mundo-de-color-backend.onrender.com`)
3. Ve a [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
4. Haz clic en **"Add endpoint"**
5. Configura:
   - **Endpoint URL:** `https://tu-url.onrender.com/stripe/webhook`
   - **Description:** `Webhook para Un Mundo de Color`
   - **Events to send:** Selecciona estos eventos:
     - ✅ `checkout.session.completed`
     - ✅ `checkout.session.expired`
     - ✅ `payment_intent.canceled`
     - ✅ `checkout.session.async_payment_failed`
6. Haz clic en **"Add endpoint"**
7. Copia el **"Signing secret"** (empieza con `whsec_...`)
8. Ve a Render > Environment y agrega:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```
9. Render reiniciará automáticamente el servicio

## Paso 5: Verificar el Despliegue

1. Ve a la URL de tu servicio en Render
2. Prueba el health check: `https://tu-url.onrender.com/health`
   - Debe responder: `{"status":"ok","timestamp":"..."}`
3. Revisa los **Logs** en Render para verificar que no hay errores
4. Deberías ver: `Firebase Admin inicializado correctamente`
5. Deberías ver: `Servidor corriendo en puerto XXXX`

## Paso 6: Configurar Frontend para Usar el Backend

En tu frontend, actualiza el archivo `.env` o `vite.config.js`:

```env
VITE_API_URL=https://tu-url.onrender.com
```

O en `frontend/src/services/stripeService.js`, verifica que use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://tu-url.onrender.com';
```

## Troubleshooting

### Error: "FIREBASE_CREDENTIALS no está configurado"
- Verifica que copiaste TODO el JSON completo
- Asegúrate de que no haya saltos de línea extra
- El JSON debe estar en una sola línea o con formato válido

### Error: "Stripe webhook signature verification failed"
- Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado correctamente
- Asegúrate de que el webhook apunte a la URL correcta
- Verifica que estás usando el secreto del webhook correcto (test vs live)

### El servicio no inicia
- Revisa los logs en Render
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `Root Directory` esté configurado como `backend`

### El servicio tarda en responder
- En el plan gratuito, Render "duerme" el servicio después de 15 minutos de inactividad
- La primera petición puede tardar 30-60 segundos en "despertar" el servicio
- Considera usar un plan pago para evitar esto

## URLs Importantes

- **Render Dashboard:** https://dashboard.render.com/
- **Stripe Dashboard (Test):** https://dashboard.stripe.com/test/apikeys
- **Stripe Webhooks:** https://dashboard.stripe.com/test/webhooks
- **Firebase Console:** https://console.firebase.google.com/

## Notas Finales

- ✅ Usa claves de **prueba** de Stripe (`sk_test_`) para desarrollo
- ✅ Cambia a claves de **producción** (`sk_live_`) cuando estés listo
- ✅ Render proporciona HTTPS automáticamente (necesario para webhooks)
- ✅ Los cambios en variables de entorno reinician el servicio automáticamente
- ✅ Revisa los logs regularmente para detectar problemas

