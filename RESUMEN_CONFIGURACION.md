# ✅ Resumen de Configuración

## 🎉 Estado Actual

### ✅ Completado:
- [x] Código subido a GitHub: `https://github.com/an243692/unmundodecolormerceria`
- [x] PK de Stripe configurada en `frontend/.env.local`
- [x] Variables de entorno configuradas en Render

### 📋 Variables en Render (Verificar):

Asegúrate de tener estas variables configuradas en Render:

1. **FIREBASE_CREDENTIALS**
   - Valor: JSON completo del Service Account de Firebase

2. **FIREBASE_DATABASE_URL**
   - Valor: `https://un-mundo-de-color-default-rtdb.firebaseio.com/`
   - (O la URL de tu Realtime Database)

3. **STRIPE_SECRET_KEY** ⚠️ IMPORTANTE
   - Valor: `sk_test_...` (tu Secret Key de prueba)
   - Esta es diferente a la PK que ya tienes

4. **STRIPE_WEBHOOK_SECRET**
   - Se configura DESPUÉS de crear el webhook en Stripe
   - Valor: `whsec_...`

5. **FRONTEND_URL**
   - Valor: URL donde está desplegado tu frontend
   - Ejemplo: `http://localhost:5173` (desarrollo) o `https://tu-frontend.vercel.app` (producción)

6. **NODE_ENV**
   - Valor: `production`

---

## 🔑 Claves de Stripe

### ✅ PK (Publishable Key) - Frontend
```
pk_test_51SdakxLVUv4xsq77BSMOHjQe9Qto27Mf8Dx8KjhDsL8cYtjdnlr8SsbjHA1569ImhAPk1N9Qv0pr5jQ5xcwhuVqA00itkDGhG3
```
**Ubicación:** `frontend/.env.local`

### ⚠️ SK (Secret Key) - Backend (Render)
**Necesitas verificar que esté en Render:**
- Variable: `STRIPE_SECRET_KEY`
- Valor: `sk_test_...` (debe empezar con `sk_test_`)

**Si no la tienes:**
1. Ve a [Stripe Dashboard - API Keys](https://dashboard.stripe.com/test/apikeys)
2. Asegúrate de estar en modo **Test**
3. En "Secret key" > "Reveal test key"
4. Copia la clave y agrégalo en Render

---

## 🚀 Próximos Pasos

### 1. Verificar que Render esté funcionando
- Ve a la URL de tu servicio en Render
- Prueba: `https://tu-url.onrender.com/health`
- Debe responder: `{"status":"ok"}`

### 2. Configurar Webhook de Stripe
**IMPORTANTE:** Haz esto DESPUÉS de que Render esté desplegado

1. Copia la URL de tu servicio en Render (ej: `https://un-mundo-de-color-backend.onrender.com`)
2. Ve a [Stripe Dashboard - Webhooks](https://dashboard.stripe.com/test/webhooks)
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

### 3. Actualizar Frontend con URL de Render
Cuando Render esté funcionando:

1. Actualiza `frontend/.env.local`:
   ```env
   VITE_API_URL=https://tu-url.onrender.com
   ```

2. O crea `frontend/.env.production` para producción:
   ```env
   VITE_API_URL=https://tu-url.onrender.com
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SdakxLVUv4xsq77BSMOHjQe9Qto27Mf8Dx8KjhDsL8cYtjdnlr8SsbjHA1569ImhAPk1N9Qv0pr5jQ5xcwhuVqA00itkDGhG3
   ```

### 4. Probar el Flujo Completo
1. Inicia el frontend: `cd frontend && npm run dev`
2. Registra un usuario
3. Agrega productos al carrito
4. Intenta hacer un pago con tarjeta de prueba:
   - Número: `4242 4242 4242 4242`
   - Fecha: `12/25`
   - CVC: `123`
   - Código Postal: `12345`

---

## 🔍 Verificación Final

### Backend (Render)
- [ ] Health check funciona: `https://tu-url.onrender.com/health`
- [ ] Logs muestran: `Firebase Admin inicializado correctamente`
- [ ] Logs muestran: `Servidor corriendo en puerto XXXX`
- [ ] No hay errores en los logs

### Frontend
- [ ] `.env.local` tiene la PK de Stripe
- [ ] `VITE_API_URL` apunta a Render (cuando esté desplegado)
- [ ] El frontend puede conectarse al backend

### Stripe
- [ ] SK configurada en Render como `STRIPE_SECRET_KEY`
- [ ] Webhook configurado en Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` configurado en Render

---

## 📞 Si Algo No Funciona

### Error: "FIREBASE_CREDENTIALS no está configurado"
- Verifica que copiaste TODO el JSON completo
- Debe incluir las llaves `{}`

### Error: "Stripe webhook signature verification failed"
- Verifica que `STRIPE_WEBHOOK_SECRET` esté correcto
- Asegúrate de que el webhook apunte a la URL correcta

### El servicio no inicia en Render
- Revisa los logs en Render
- Verifica que `Root Directory` esté configurado como `backend`
- Verifica que todas las variables de entorno estén configuradas

---

## 🎯 Checklist Final

- [x] Código en GitHub
- [x] PK de Stripe en frontend
- [ ] SK de Stripe en Render (verificar)
- [ ] Backend desplegado en Render
- [ ] Health check funciona
- [ ] Webhook de Stripe configurado
- [ ] Frontend actualizado con URL de Render
- [ ] Prueba de pago exitosa

¡Todo listo para procesar pagos! 🎉

