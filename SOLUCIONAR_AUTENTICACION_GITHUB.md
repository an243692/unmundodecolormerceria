# 🔐 Solucionar Autenticación de GitHub

El código está listo para subir, pero necesitas autenticarte. Aquí tienes 3 opciones:

## ✅ Opción 1: GitHub Desktop (MÁS FÁCIL - Recomendado)

1. **Descarga GitHub Desktop:**
   - Ve a: https://desktop.github.com/
   - Descarga e instala GitHub Desktop

2. **Inicia sesión:**
   - Abre GitHub Desktop
   - Inicia sesión con tu cuenta de GitHub (`unmundodecolormeceria`)

3. **Abre el repositorio:**
   - File > Add Local Repository
   - Selecciona la carpeta: `C:\Users\Victor Andre\Downloads\catalogo clientes 3 (2) (2)\un mundo de color`
   - Haz clic en "Add repository"

4. **Publica el repositorio:**
   - Verás que hay commits pendientes
   - Haz clic en "Publish repository"
   - Asegúrate de que el nombre sea: `tienda-online`
   - Marca "Keep this code private" si quieres (o déjalo público)
   - Haz clic en "Publish repository"

¡Listo! El código se subirá automáticamente.

---

## ✅ Opción 2: Personal Access Token (Terminal)

### Paso 1: Crear Personal Access Token

1. Ve a: https://github.com/settings/tokens
2. Haz clic en **"Generate new token"** > **"Generate new token (classic)"**
3. Configura:
   - **Note:** `Token para tienda-online`
   - **Expiration:** `90 days` (o el tiempo que prefieras)
   - **Select scopes:** Marca solo `repo` (esto da acceso completo a repositorios)
4. Haz clic en **"Generate token"**
5. **⚠️ IMPORTANTE:** Copia el token inmediatamente (solo se muestra una vez)
   - Se verá algo como: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Paso 2: Usar el Token

Ejecuta estos comandos en PowerShell:

```powershell
cd "C:\Users\Victor Andre\Downloads\catalogo clientes 3 (2) (2)\un mundo de color"

# Configurar el remote con el token
git remote set-url origin https://ghp_TU_TOKEN_AQUI@github.com/unmundodecolormeceria/tienda-online.git

# O mejor, usa el token cuando te lo pida:
git push -u origin main
```

Cuando te pida:
- **Username:** `unmundodecolormeceria`
- **Password:** Pega el token (NO tu contraseña de GitHub)

---

## ✅ Opción 3: SSH (Para uso avanzado)

Si prefieres usar SSH, necesitas:

1. Generar una clave SSH
2. Agregarla a tu cuenta de GitHub
3. Cambiar el remote a SSH

Pero las opciones 1 y 2 son más fáciles.

---

## 🚀 Después de Subir

Una vez que el código esté en GitHub:

1. Ve a: https://github.com/unmundodecolormeceria/tienda-online
2. Verifica que todos los archivos estén ahí
3. Sigue la guía `GUIA_RAPIDA_RENDER.md` para configurar Render

---

## ❓ ¿Cuál Opción Elegir?

- **GitHub Desktop:** Si prefieres una interfaz gráfica y no quieres lidiar con tokens
- **Personal Access Token:** Si prefieres usar la terminal y tener más control
- **SSH:** Si ya tienes experiencia con SSH y claves

**Recomendación:** Usa GitHub Desktop (Opción 1) - es la más fácil y rápida.

---

## 🔍 Verificar que Funcionó

Después de subir, verifica:

1. Ve a: https://github.com/unmundodecolormeceria/tienda-online
2. Deberías ver:
   - ✅ Carpeta `frontend/`
   - ✅ Carpeta `backend/`
   - ✅ Carpeta `admin/`
   - ✅ Archivos `.md` de documentación
   - ✅ `.gitignore`

Si ves todo esto, ¡el código está subido correctamente! 🎉

