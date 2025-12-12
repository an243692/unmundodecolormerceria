# Configuración de Firebase

## ⚠️ IMPORTANTE: Habilitar Firebase Authentication

El error "auth/configuration-not-found" significa que Firebase Authentication no está habilitado en tu proyecto.

### Pasos para habilitar Firebase Auth:

1. **Ve a Firebase Console**
   - Abre [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Selecciona tu proyecto: **un-mundo-de-color**

2. **Habilita Authentication**
   - En el menú lateral, haz clic en **"Authentication"** (o "Autenticación")
   - Si es la primera vez, haz clic en **"Get Started"** (Comenzar)
   - Ve a la pestaña **"Sign-in method"** (Método de inicio de sesión)

3. **Habilita Email/Password**
   - Busca **"Email/Password"** en la lista
   - Haz clic en él
   - **Activa** el primer toggle (Enable)
   - Haz clic en **"Save"** (Guardar)

4. **Verifica la configuración**
   - Asegúrate de que el dominio autorizado incluya:
     - `localhost` (para desarrollo)
     - Tu dominio de producción (cuando lo despliegues)

## Verificar configuración del proyecto

### 1. Firestore Database
- Ve a **Firestore Database** en Firebase Console
- Crea la base de datos si no existe
- Configura las reglas (ver abajo)

### 2. Realtime Database
- Ve a **Realtime Database** en Firebase Console
- Crea la base de datos si no existe
- URL debe ser: `https://un-mundo-de-color-default-rtdb.firebaseio.com/`

### 3. Reglas de Seguridad

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: lectura pública, escritura solo para admin
    match /products/{document=**} {
      allow read: if true;
      allow write: if true; // En producción, agrega autenticación
    }
  }
}
```

#### Realtime Database Rules:
```json
{
  "rules": {
    "orders": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()",
        ".write": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()"
      }
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()",
        ".write": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()"
      }
    },
    "admins": {
      ".read": false,
      ".write": false
    }
  }
}
```

## Verificar configuración en el código

La configuración de Firebase debe coincidir con la de tu proyecto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCMw7wzlZnosYEh1qqas1wboAhpR1ELh_Q",
  authDomain: "un-mundo-de-color.firebaseapp.com",
  projectId: "un-mundo-de-color",
  storageBucket: "un-mundo-de-color.firebasestorage.app",
  messagingSenderId: "570098047760",
  appId: "1:570098047760:web:0093305899487bce90e395",
  measurementId: "G-8MQ9J9JRCB",
  databaseURL: "https://un-mundo-de-color-default-rtdb.firebaseio.com/"
};
```

## Solución de problemas

### Error: "auth/configuration-not-found"
- ✅ Verifica que Authentication esté habilitado
- ✅ Verifica que Email/Password esté activado
- ✅ Recarga la página después de habilitar

### Error: "Firebase no se pudo cargar"
- ✅ Verifica tu conexión a internet
- ✅ Verifica que los scripts de Firebase se carguen (F12 > Network)
- ✅ Prueba en modo incógnito para descartar extensiones

### Error: "Permission denied"
- ✅ Verifica las reglas de seguridad
- ✅ Asegúrate de que el usuario esté autenticado

