# 🚀 Guía Rápida: Subir a GitHub y Configurar Render

## ✅ Paso 1: Subir Código a GitHub

El código ya está preparado localmente. Ahora necesitas autenticarte en GitHub:

### Opción A: Usar GitHub Desktop (Más Fácil)
1. Descarga [GitHub Desktop](https://desktop.github.com/)
2. Inicia sesión con tu cuenta de GitHub
3. File > Add Local Repository
4. Selecciona la carpeta del proyecto
5. Haz clic en "Publish repository"

### Opción B: Usar Terminal con Personal Access Token
1. Ve a GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Genera un nuevo token con permisos `repo`
3. Copia el token
4. Ejecuta en PowerShell:
```powershell
cd "C:\Users\Victor Andre\Downloads\catalogo clientes 3 (2) (2)\un mundo de color"
git push -u origin main
```
5. Cuando pida usuario: tu usuario de GitHub
6. Cuando pida contraseña: pega el Personal Access Token (NO tu contraseña)

### Opción C: Usar SSH (Recomendado para producción)
1. Genera una clave SSH en GitHub
2. Cambia el remote:
```powershell
git remote set-url origin git@github.com:unmundodecolormeceria/tienda-online.git
git push -u origin main
```

## ✅ Paso 2: Crear Web Service en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Haz clic en **"New +"** > **"Web Service"**
3. Conecta tu repositorio:
   - Busca: `unmundodecolormeceria/tienda-online`
   - Autoriza Render si es necesario
4. Configura el servicio:
   ```
   Name: un-mundo-de-color-backend
   Environment: Node
   Region: (elige la más cercana)
   Branch: main
   Root Directory: backend  ⚠️ IMPORTANTE
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```
5. Haz clic en **"Create Web Service"**

## ✅ Paso 3: Configurar Variables de Entorno

En Render, ve a **Environment** y agrega estas variables:

### 1. Firebase Credentials
```
FIREBASE_CREDENTIALS
```
**Valor:** Copia TODO el contenido del archivo JSON de Service Account de Firebase.

**Cómo obtenerlo:**
1. [Firebase Console](https://console.firebase.google.com/) > Tu proyecto
2. ⚙️ Project Settings > Service Accounts
3. "Generate new private key" > Descarga el JSON
4. Abre el archivo y copia TODO (incluyendo `{}`)
5. Pégalo en Render

### 2. Firebase Database URL
```
FIREBASE_DATABASE_URL
```
**Valor:** `https://un-mundo-de-color-default-rtdb.firebaseio.com/`

(O la URL de tu Realtime Database en Firebase Console)

### 3. Stripe Secret Key (PRUEBA)
```
STRIPE_SECRET_KEY
```
**Valor:** `sk_test_...` (tu clave secreta de prueba)

**Cómo obtenerla:**
1. [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Asegúrate de estar en modo **Test** (toggle arriba)
3. En "Secret key" > "Reveal test key"
4. Copia la clave (empieza con `sk_test_...`)

### 4. Stripe Webhook Secret
```
STRIPE_WEBHOOK_SECRET
```
**⚠️ IMPORTANTE:** Configura esto DESPUÉS de que Render despliegue el servicio (ver Paso 4)

### 5. Frontend URL
```
FRONTEND_URL
```
**Valor:** La URL donde está tu frontend:
- Desarrollo: `http://localhost:5173`
- Producción: `https://tu-frontend.vercel.app` (o donde lo despliegues)

### 6. Node Environment
```
NODE_ENV
```
**Valor:** `production`

### 7. Puerto (Opcional)
```
PORT
```
**Valor:** Déjalo vacío (Render lo asigna automáticamente)

## ✅ Paso 4: Configurar Webhook de Stripe

**Espera a que Render termine el despliegue primero.**

1. Copia la URL de tu servicio en Render (ej: `https://un-mundo-de-color-backend.onrender.com`)
2. Ve a [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/test/webhooks)
3. Haz clic en **"Add endpoint"**
4. Configura:
   - **Endpoint URL:** `https://tu-url.onrender.com/stripe/webhook`
   - **Description:** `Webhook para Un Mundo de Color`
   - **Events to send:** Selecciona:
     - ✅ `checkout.session.completed`
     - ✅ `checkout.session.expired`
     - ✅ `payment_intent.canceled`
     - ✅ `checkout.session.async_payment_failed`
5. Haz clic en **"Add endpoint"**
6. Copia el **"Signing secret"** (empieza con `whsec_...`)
7. Ve a Render > Environment y agrega:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```
8. Render reiniciará automáticamente

## ✅ Paso 5: Verificar que Funciona

1. Ve a la URL de tu servicio: `https://tu-url.onrender.com/health`
2. Debe responder: `{"status":"ok","timestamp":"..."}`
3. Revisa los **Logs** en Render:
   - Debe decir: `Firebase Admin inicializado correctamente`
   - Debe decir: `Servidor corriendo en puerto XXXX`
   - NO debe haber errores rojos

## 🔑 Claves de Stripe de Prueba

Cuando tengas las claves de prueba de Stripe, compártelas y te ayudo a configurarlas. Necesitas:

1. **Publishable Key (PK):** `pk_test_...`
   - Se usa en el frontend
   - La agregas en `frontend/.env` como `VITE_STRIPE_PUBLISHABLE_KEY`

2. **Secret Key (SK):** `sk_test_...`
   - Se usa en el backend
   - La agregas en Render como `STRIPE_SECRET_KEY`

## 📝 Checklist Final

- [ ] Código subido a GitHub
- [ ] Web Service creado en Render
- [ ] Variables de entorno configuradas:
  - [ ] FIREBASE_CREDENTIALS
  - [ ] FIREBASE_DATABASE_URL
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] FRONTEND_URL
  - [ ] NODE_ENV
- [ ] Webhook de Stripe configurado
- [ ] Health check funciona
- [ ] Logs sin errores

## 🆘 Problemas Comunes

### "Permission denied" al subir a GitHub
- Usa un Personal Access Token en lugar de tu contraseña
- O usa GitHub Desktop

### "FIREBASE_CREDENTIALS no está configurado"
- Verifica que copiaste TODO el JSON completo
- Debe incluir las llaves `{}`

### El servicio no inicia
- Revisa los logs en Render
- Verifica que `Root Directory` esté configurado como `backend`

### Webhook no funciona
- Verifica que la URL del webhook sea correcta
- Asegúrate de que `STRIPE_WEBHOOK_SECRET` esté configurado
- Verifica que estás en modo Test en Stripe

## 📞 Próximos Pasos

Una vez que Render esté funcionando:
1. Actualiza `VITE_API_URL` en el frontend con la URL de Render
2. Despliega el frontend en Vercel/Netlify
3. Actualiza `FRONTEND_URL` en Render con la URL del frontend
4. Prueba hacer un pedido con tarjeta de prueba

¡Listo! 🎉

