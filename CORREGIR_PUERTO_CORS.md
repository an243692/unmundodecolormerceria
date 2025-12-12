# 🔧 Corrección: Puerto y CORS

## 🔍 Problema Detectado

Tu frontend está corriendo en `localhost:3001`, pero en Render tienes configurado:
```
FRONTEND_URL = http://localhost:3000
```

Esto causa problemas de CORS porque el backend solo permite requests desde `localhost:3000`.

## ✅ Solución

### Opción 1: Actualizar FRONTEND_URL en Render (Recomendado)

1. Ve a Render Dashboard
2. Selecciona tu servicio `unmundodecolormerceria`
3. Ve a **Environment**
4. Busca `FRONTEND_URL`
5. Cámbialo a:
   ```
   FRONTEND_URL = http://localhost:3001
   ```
6. Render reiniciará automáticamente

### Opción 2: Cambiar el Puerto de Vite a 3000

Si prefieres usar el puerto 3000, actualiza `frontend/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Cambiar de 3001 a 3000
    open: true
  }
})
```

Luego reinicia el servidor.

## 🧪 Verificación

Después de hacer el cambio:

1. **Reinicia el servidor del frontend** (Ctrl+C y luego `npm run dev`)
2. **Verifica que esté en el puerto correcto** (debería decir en la terminal)
3. **Abre la consola del navegador** (F12 > Console)
4. **Ejecuta:**
   ```javascript
   fetch('https://unmundodecolormerceria.onrender.com/health')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

**Si funciona:** Deberías ver `{status: "ok", ...}`
**Si falla con CORS:** El `FRONTEND_URL` en Render no coincide con tu puerto

## 📝 Nota sobre Free Tier de Render

Si el backend está en el plan gratuito de Render, puede "dormirse" después de 15 minutos de inactividad. La primera petición puede tardar 30-60 segundos en "despertar" el servicio.

Si ves que tarda mucho, espera un momento y vuelve a intentar.

