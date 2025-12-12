# 🔧 Solución: Error "Failed to fetch"

## 🔍 Diagnóstico

El backend está funcionando correctamente en Render, pero el frontend no puede conectarse. Esto suele pasar porque:

1. **El servidor de desarrollo no se reinició** después de actualizar `.env.local`
2. **Vite no está leyendo la variable de entorno** correctamente

## ✅ Solución Paso a Paso

### Paso 1: Verificar que .env.local esté correcto

El archivo `frontend/.env.local` debe contener:
```env
VITE_API_URL=https://unmundodecolormerceria.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SdakxLVUv4xsq77BSMOHjQe9Qto27Mf8Dx8KjhDsL8cYtjdnlr8SsbjHA1569ImhAPk1N9Qv0pr5jQ5xcwhuVqA00itkDGhG3
```

### Paso 2: REINICIAR el Servidor de Desarrollo

**MUY IMPORTANTE:** Vite solo lee las variables de entorno al iniciar. Si actualizaste `.env.local`, debes:

1. **Detener el servidor:**
   - Ve a la terminal donde está corriendo `npm run dev`
   - Presiona `Ctrl + C`

2. **Reiniciar el servidor:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Recargar el navegador:**
   - Presiona `F5` o `Ctrl + R` para recargar la página

### Paso 3: Verificar en la Consola del Navegador

1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Console**
3. Escribe esto y presiona Enter:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL)
   ```

**Deberías ver:**
```
API URL: https://unmundodecolormerceria.onrender.com
```

**Si ves `undefined` o `http://localhost:5000`:**
- El servidor no se reinició correctamente
- O el archivo `.env.local` no está en el lugar correcto

### Paso 4: Verificar CORS en Render

En Render, verifica que `FRONTEND_URL` esté configurado como:
```
FRONTEND_URL = http://localhost:3000
```

(Sin la barra final `/`)

## 🧪 Prueba Rápida

Abre la consola del navegador (F12) y ejecuta:

```javascript
fetch('https://unmundodecolormerceria.onrender.com/health')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Backend responde:', data);
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
```

**Si funciona:** Deberías ver `{status: "ok", ...}`
**Si falla:** Hay un problema de red o CORS

## 🔄 Si Sigue Sin Funcionar

### Opción A: Verificar que el archivo esté en el lugar correcto

El archivo debe estar en:
```
frontend/.env.local
```

NO en:
- `frontend/frontend/.env.local` ❌
- `.env.local` (raíz) ❌

### Opción B: Usar .env en lugar de .env.local

Si `.env.local` no funciona, crea `frontend/.env`:

```env
VITE_API_URL=https://unmundodecolormerceria.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SdakxLVUv4xsq77BSMOHjQe9Qto27Mf8Dx8KjhDsL8cYtjdnlr8SsbjHA1569ImhAPk1N9Qv0pr5jQ5xcwhuVqA00itkDGhG3
```

Y reinicia el servidor.

### Opción C: Verificar el puerto de Vite

Vite puede estar corriendo en un puerto diferente. Verifica en la terminal qué puerto está usando (puede ser 5173 en lugar de 3000).

Si es así, actualiza `FRONTEND_URL` en Render:
```
FRONTEND_URL = http://localhost:5173
```

## 📝 Checklist

- [ ] Archivo `.env.local` existe en `frontend/`
- [ ] Contiene `VITE_API_URL=https://unmundodecolormerceria.onrender.com`
- [ ] Servidor de desarrollo se reinició después de actualizar `.env.local`
- [ ] Navegador se recargó (F5)
- [ ] `FRONTEND_URL` está configurado en Render
- [ ] Consola del navegador muestra la URL correcta

## 🎯 Lo Más Importante

**REINICIA EL SERVIDOR DE DESARROLLO** después de cualquier cambio en `.env.local`. Vite solo lee las variables de entorno al iniciar.

