# Reglas de Firebase (Sin Autenticación)

Como el sistema funciona sin autenticación, las reglas deben permitir acceso público para lectura y escritura.

## Firestore Rules

Ve a Firebase Console > Firestore Database > Rules y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: acceso público para lectura y escritura
    match /products/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Realtime Database Rules

Ve a Firebase Console > Realtime Database > Rules y pega esto:

```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true
    },
    "users": {
      ".read": true,
      ".write": true
    }
  }
}
```

## ⚠️ IMPORTANTE - Seguridad

**Estas reglas permiten acceso público completo.** Esto es adecuado para desarrollo o si no necesitas seguridad.

Si en el futuro quieres agregar seguridad:
- Agrega autenticación de Firebase
- Restringe acceso basado en usuarios autenticados
- Implementa validación de datos en el backend

## Aplicar las Reglas

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **un-mundo-de-color**
3. Para Firestore: Firestore Database > Rules > Pega las reglas > Publicar
4. Para Realtime Database: Realtime Database > Rules > Pega las reglas > Publicar

