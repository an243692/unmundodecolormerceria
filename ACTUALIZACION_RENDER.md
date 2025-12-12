# ✅ Backend Desplegado en Render

## 🎉 Estado Actual

- **URL del Backend:** https://unmundodecolormerceria.onrender.com
- **Estado:** ✅ Funcionando
- **Frontend configurado:** ✅ Actualizado

## 📋 Pasos para que Funcione el Pago

### 1. Reiniciar el Servidor del Frontend

**IMPORTANTE:** Después de actualizar `.env.local`, debes reiniciar el servidor de desarrollo:

1. Ve a la terminal donde está corriendo el frontend
2. Presiona `Ctrl + C` para detenerlo
3. Vuelve a iniciarlo:
   ```bash
   cd frontend
   npm run dev
   ```

### 2. Verificar que el Backend Responda

Abre en tu navegador:
```
https://unmundodecolormerceria.onrender.com/health
```

Deberías ver:
```json
{"status":"ok","timestamp":"..."}
```

### 3. Verificar Variables en Render

Asegúrate de tener estas variables configuradas en Render:

✅ **STRIPE_SECRET_KEY** = `sk_test_...` (IMPORTANTE - sin esto no funciona)
✅ **FIREBASE_CREDENTIALS** = JSON completo
✅ **FIREBASE_DATABASE_URL** = URL de Realtime Database
✅ **FRONTEND_URL** = `http://localhost:3000` (para desarrollo local)
✅ **NODE_ENV** = `production`

### 4. Probar el Pago

1. Reinicia el frontend (paso 1)
2. Abre la aplicación en el navegador
3. Agrega productos al carrito
4. Haz clic en "Pagar con Tarjeta"
5. Debería redirigirte a Stripe Checkout

## 🔧 Si Sigue Sin Funcionar

### Error: "Failed to fetch"

**Causa:** El frontend no se reinició después de actualizar `.env.local`

**Solución:**
1. Detén el servidor del frontend (Ctrl+C)
2. Reinícialo: `npm run dev`
3. Recarga la página en el navegador (F5)

### Error: CORS

**Causa:** El backend no permite requests desde tu frontend

**Solución:**
En Render, verifica que `FRONTEND_URL` esté configurado como:
```
FRONTEND_URL = http://localhost:3000
```

O si tu frontend está en otro puerto (ej: 5173):
```
FRONTEND_URL = http://localhost:5173
```

### Error: "Error al crear sesión de checkout"

**Causa:** Falta `STRIPE_SECRET_KEY` en Render

**Solución:**
1. Ve a [Stripe Dashboard - API Keys](https://dashboard.stripe.com/test/apikeys)
2. Asegúrate de estar en modo **Test**
3. En "Secret key" > "Reveal test key"
4. Copia la clave (empieza con `sk_test_...`)
5. Ve a Render > Environment
6. Agrega: `STRIPE_SECRET_KEY` = `sk_test_...`
7. Render reiniciará automáticamente

## 🧪 Prueba Rápida

Abre la consola del navegador (F12) y ejecuta:

```javascript
fetch('https://unmundodecolormerceria.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Si funciona:** Deberías ver `{status: "ok", ...}`
**Si falla:** Revisa los logs en Render

## 📝 Checklist Final

- [x] Backend desplegado en Render
- [x] `.env.local` actualizado con URL de Render
- [ ] Frontend reiniciado (después de actualizar .env.local)
- [ ] `STRIPE_SECRET_KEY` configurado en Render
- [ ] `FRONTEND_URL` configurado en Render
- [ ] Health check funciona
- [ ] Pago con tarjeta funciona

## 🎯 Próximos Pasos

1. **Reinicia el frontend** (muy importante)
2. **Verifica que `STRIPE_SECRET_KEY` esté en Render**
3. **Prueba hacer un pago**
4. **Configura el webhook de Stripe** (después de que funcione el pago)

¡Todo listo! 🚀

