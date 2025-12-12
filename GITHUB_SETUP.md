# Configuración de GitHub

## Pasos para subir el proyecto a GitHub

### 1. Inicializar Git (si no está inicializado)
```bash
git init
```

### 2. Agregar todos los archivos
```bash
git add .
```

### 3. Hacer commit inicial
```bash
git commit -m "Initial commit: E-commerce Un Mundo de Color"
```

### 4. Crear repositorio en GitHub
1. Ve a [GitHub](https://github.com/new)
2. Crea un nuevo repositorio (puede ser privado o público)
3. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)

### 5. Conectar y subir
```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

## Estructura del Repositorio

El repositorio incluye:
- `/frontend` - Aplicación React
- `/admin` - Panel de administración (HTML/CSS/JS)
- `/backend` - API Express.js
- `/README.md` - Documentación principal
- `/.gitignore` - Archivos a ignorar

## Archivos que NO se suben (por .gitignore)
- `node_modules/`
- `.env` y archivos de entorno
- Archivos de build (`dist/`, `build/`)
- Logs y archivos temporales

## Después de subir

1. **Configura Render** para que se conecte a este repositorio
2. **Configura las variables de entorno** en Render (ver RENDER_SETUP.md)
3. **Despliega el frontend** en Vercel/Netlify/Firebase Hosting
4. **Actualiza FRONTEND_URL** en Render con la URL del frontend desplegado

