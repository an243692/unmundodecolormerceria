import { ref, push, set, get, query, orderByChild, equalTo, onValue, remove } from 'firebase/database';
import { database } from './firebase';

export const createOrder = async (orderData) => {
  try {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    const orderId = newOrderRef.key;
    
    const order = {
      ...orderData,
      orderId,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    await set(newOrderRef, order);
    return orderId;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const ordersRef = ref(database, 'orders');
    const q = query(ordersRef, orderByChild('userId'), equalTo(userId));
    
    return new Promise((resolve, reject) => {
      onValue(q, (snapshot) => {
        const orders = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            orders.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          // Ordenar por fecha (más recientes primero)
          orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
        resolve(orders);
      }, (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

export const updateOrder = async (orderId, updates) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    const snapshot = await get(orderRef);
    
    if (!snapshot.exists()) {
      throw new Error('Pedido no encontrado');
    }
    
    const currentData = snapshot.val();
    await set(orderRef, {
      ...currentData,
      ...updates,
      updatedAt: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    await remove(orderRef);
    return true;
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    throw error;
  }
};

export const getAllOrders = () => {
  return new Promise((resolve, reject) => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const orders = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          orders.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        // Ordenar por fecha (más recientes primero)
        orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }
      resolve(orders);
    }, (error) => {
      reject(error);
    });
  });
};

// Limpiar pedidos abandonados (pendientes > 30 minutos)
export const cleanupAbandonedOrders = async () => {
  try {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    
    if (!snapshot.exists()) return;
    
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    const promises = [];
    
    snapshot.forEach((childSnapshot) => {
      const order = childSnapshot.val();
      if (order.status === 'pending' && (now - order.timestamp) > thirtyMinutes) {
        promises.push(remove(ref(database, `orders/${childSnapshot.key}`)));
      }
    });
    
    await Promise.all(promises);
    return promises.length;
  } catch (error) {
    console.error('Error al limpiar pedidos abandonados:', error);
    throw error;
  }
};

