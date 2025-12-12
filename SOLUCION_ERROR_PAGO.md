# 🔧 Solución: Error al Procesar Pago

## 🔍 Diagnóstico del Error

El error "Error al procesar el pago" puede tener varias causas. Sigue estos pasos para diagnosticarlo:

### 1. Verificar que el Backend esté Corriendo

**Si estás probando localmente:**

Abre una nueva terminal y ejecuta:
```bash
cd backend
npm install
npm start
```

El backend debe estar corriendo en `http://localhost:5000`

**Si el backend está en Render:**
- Verifica que el servicio esté activo en Render Dashboard
- Copia la URL de tu servicio (ej: `https://tu-app.onrender.com`)
- Actualiza `frontend/.env.local`:
  ```env
  VITE_API_URL=https://tu-url.onrender.com
  ```

### 2. Verificar la Consola del Navegador

1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Console**
3. Intenta hacer el pago de nuevo
4. Revisa los errores que aparecen

**Errores comunes:**

- `Failed to fetch` o `NetworkError`
  - **Causa:** El backend no está corriendo o la URL está mal
  - **Solución:** Verifica que el backend esté activo y la URL en `.env.local`

- `CORS policy`
  - **Causa:** El backend no permite requests desde tu frontend
  - **Solución:** Verifica `FRONTEND_URL` en Render o CORS en el backend

- `Error 500` o `Error al crear sesión de checkout`
  - **Causa:** Falta `STRIPE_SECRET_KEY` en el backend
  - **Solución:** Agrega `STRIPE_SECRET_KEY` en Render

### 3. Verificar Variables de Entorno

**En Render, verifica que tengas:**

✅ `STRIPE_SECRET_KEY` = `sk_test_...` (IMPORTANTE - sin esto no funciona)
✅ `FIREBASE_CREDENTIALS` = JSON completo
✅ `FIREBASE_DATABASE_URL` = URL de Realtime Database
✅ `FRONTEND_URL` = `http://localhost:5173` (o tu URL de frontend)
✅ `NODE_ENV` = `production`

### 4. Verificar Logs del Backend

**Si el backend está en Render:**
1. Ve a Render Dashboard
2. Selecciona tu servicio
3. Ve a la pestaña **Logs**
4. Intenta hacer el pago de nuevo
5. Revisa los errores que aparecen

**Errores comunes en logs:**
- `STRIPE_SECRET_KEY is not defined`
  - **Solución:** Agrega la variable en Render

- `FIREBASE_CREDENTIALS no está configurado`
  - **Solución:** Verifica que el JSON esté completo

### 5. Probar la Conexión Manualmente

Abre la consola del navegador (F12) y ejecuta:

```javascript
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Si funciona:** Deberías ver `{status: "ok", ...}`
**Si falla:** El backend no está corriendo o la URL está mal

## ✅ Soluciones Rápidas

### Solución 1: Backend Local No Está Corriendo

```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend (en otra terminal)
cd frontend
npm run dev
```

### Solución 2: URL del API Incorrecta

Verifica `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

Si el backend está en Render:
```env
VITE_API_URL=https://tu-url.onrender.com
```

**IMPORTANTE:** Después de cambiar `.env.local`, reinicia el servidor de desarrollo:
```bash
# Detén el servidor (Ctrl+C) y vuelve a iniciarlo
npm run dev
```

### Solución 3: Falta STRIPE_SECRET_KEY

1. Ve a [Stripe Dashboard - API Keys](https://dashboard.stripe.com/test/apikeys)
2. Asegúrate de estar en modo **Test**
3. En "Secret key" > "Reveal test key"
4. Copia la clave (empieza con `sk_test_...`)
5. Ve a Render > Environment
6. Agrega: `STRIPE_SECRET_KEY` = `sk_test_...`
7. Render reiniciará automáticamente

### Solución 4: CORS Bloqueando Requests

Si el backend está en Render, verifica `FRONTEND_URL`:
```
FRONTEND_URL = http://localhost:5173
```

O si el frontend está desplegado:
```
FRONTEND_URL = https://tu-frontend.vercel.app
```

## 🧪 Prueba Paso a Paso

1. **Verifica que el backend responda:**
   - Abre: `http://localhost:5000/health`
   - Debe mostrar: `{"status":"ok"}`

2. **Verifica la consola del navegador:**
   - F12 > Console
   - Intenta el pago
   - Revisa los errores

3. **Verifica los logs del backend:**
   - Si está local: revisa la terminal donde corre el backend
   - Si está en Render: revisa los logs en Render Dashboard

4. **Prueba con curl (opcional):**
   ```bash
   curl -X POST http://localhost:5000/create-checkout-session \
     -H "Content-Type: application/json" \
     -d '{"items":[{"name":"Test","unitPrice":100,"quantity":1}],"orderId":"test123","userInfo":{"email":"test@test.com"}}'
   ```

## 📞 Si Nada Funciona

Comparte:
1. El error exacto de la consola del navegador (F12 > Console)
2. Los logs del backend (Render o terminal local)
3. La URL que estás usando en `VITE_API_URL`

Con esa información podré ayudarte mejor.

