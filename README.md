# Un Mundo de Color - Tienda Online

E-commerce completo con React, Firebase y Stripe.

## 🚀 Estructura del Proyecto

```
un-mundo-de-color/
├── frontend/          # Aplicación React (Vite)
├── admin/            # Panel de administración (HTML/CSS/JS)
└── backend/          # API Express.js para Render
```

## 📋 Características

- ✅ Catálogo de productos con filtros y búsqueda
- ✅ Autenticación de usuarios con Firebase
- ✅ Carrito de compras con persistencia
- ✅ Pagos con tarjeta mediante Stripe
- ✅ Pedidos por WhatsApp
- ✅ Panel de administración completo
- ✅ Historial de pedidos por usuario
- ✅ Diseño responsive y moderno

## 🛠️ Tecnologías

- **Frontend:** React, Vite, React Router, Context API
- **Backend:** Express.js, Firebase Admin, Stripe
- **Base de Datos:** Firebase Firestore + Realtime Database
- **Autenticación:** Firebase Authentication
- **Pagos:** Stripe
- **Deploy:** Render (Backend), Vercel/Netlify (Frontend)

## 📦 Instalación

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend (Local)
```bash
cd backend
npm install
npm run dev
```

### Admin Panel
Abre `admin/admin.html` en tu navegador.

## 🔧 Configuración

### Firebase
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password)
3. Crea Firestore Database
4. Crea Realtime Database
5. Configura las reglas de seguridad (ver `FIREBASE_RULES.md`)

### Stripe
1. Crea una cuenta en [Stripe](https://stripe.com/)
2. Obtén tus claves de API (Test mode)
3. Configura el webhook en el backend

### Variables de Entorno

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

#### Backend (.env)
```env
FIREBASE_CREDENTIALS={...}
FIREBASE_DATABASE_URL=https://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=production
```

## 🚀 Despliegue

### Backend en Render
Ver `RENDER_CONFIG_COMPLETA.md` para instrucciones detalladas.

### Frontend
- **Vercel:** Conecta tu repositorio de GitHub
- **Netlify:** Arrastra la carpeta `frontend/dist` después de `npm run build`
- **Firebase Hosting:** Usa `firebase deploy`

### Admin Panel
Sube la carpeta `admin/` a cualquier hosting estático.

## 📚 Documentación

- `FIREBASE_SETUP.md` - Configuración de Firebase
- `RENDER_CONFIG_COMPLETA.md` - Despliegue en Render
- `GITHUB_SETUP.md` - Configuración de GitHub
- `VARIABLES_ENTORNO.md` - Variables de entorno

## 📝 Scripts Útiles

### Subir a GitHub
```powershell
.\SUBIR_GITHUB.ps1
```

### Build Frontend
```bash
cd frontend
npm run build
```

## 🔐 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ CORS configurado
- ✅ Rate limiting en API
- ✅ Helmet para headers de seguridad
- ✅ Validación de webhooks de Stripe

## 📞 Soporte

Para problemas o preguntas, revisa los logs en:
- Render Dashboard (Backend)
- Console del navegador (Frontend)
- Firebase Console (Base de datos)

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para Un Mundo de Color.
