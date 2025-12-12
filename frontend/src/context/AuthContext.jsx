import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Cargar perfil del usuario desde Realtime Database
        try {
          const userRef = ref(database, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserProfile(snapshot.val());
          }
        } catch (error) {
          console.error('Error al cargar perfil:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, fullName, phone, address) => {
    try {
      // Verificar que auth esté inicializado
      if (!auth) {
        throw new Error('Firebase Auth no está inicializado. Por favor recarga la página.');
      }
      
      console.log('Registrando usuario:', email);
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuario creado:', userCredential.user.uid);
      
      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, { displayName: fullName });
      
      // Guardar información adicional en Realtime Database
      const userData = {
        fullName,
        email,
        phone,
        address,
        createdAt: Date.now()
      };
      
      await set(ref(database, `users/${userCredential.user.uid}`), userData);
      
      setUserProfile(userData);
      toast.success('¡Registro exitoso!');
      return userCredential.user;
    } catch (error) {
      console.error('Error en registro:', error);
      console.error('Error code:', error.code);
      
      // Mensajes de error más amigables
      let errorMessage = 'Error al registrar usuario';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado. Inicia sesión en su lugar.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El email no es válido.';
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Firebase Authentication no está configurado. Por favor habilita Email/Password en Firebase Console.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      if (!auth) {
        throw new Error('Firebase Auth no está inicializado. Por favor recarga la página.');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      toast.success('¡Bienvenido de nuevo!');
      return userCredential.user;
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado. Verifica tu email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('rememberMe');
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Error en logout:', error);
      toast.error('Error al cerrar sesión');
      throw error;
    }
  };

  const updateUserProfile = async (phone, address) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      const updatedData = {
        ...userProfile,
        phone,
        address,
        updatedAt: Date.now()
      };
      
      await set(ref(database, `users/${user.uid}`), updatedData);
      setUserProfile(updatedData);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar perfil');
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

