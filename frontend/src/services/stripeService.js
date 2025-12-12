const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const createCheckoutSession = async (items, orderId, userInfo, userId) => {
  try {
    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        orderId,
        userInfo,
        userId: userId || ''
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear sesión de checkout');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error al crear sesión de checkout:', error);
    throw error;
  }
};

export const generateWhatsAppMessage = (orderData) => {
  const { userInfo, items, total, deliveryInfo } = orderData;
  
  let message = `*PEDIDO DE ${userInfo.fullName.toUpperCase()}*\n\n`;
  message += `*Productos:*\n`;
  
  items.forEach(item => {
    const price = item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
      ? item.wholesalePrice
      : item.unitPrice;
    message += `- ${item.name} x${item.quantity} = $${(price * item.quantity).toFixed(2)}\n`;
  });
  
  message += `\n*Total: $${total.toFixed(2)}*\n\n`;
  message += `*Tipo de entrega:* ${deliveryInfo.type === 'pickup' ? 'Recoger en tienda' : 'Envío a domicilio'}\n`;
  
  if (deliveryInfo.type === 'pickup') {
    message += `*Tienda:* ${deliveryInfo.store || 'Las Cruces No 40, Col. Centro'}\n`;
  } else {
    message += `*Dirección:*\n`;
    message += `Calle: ${deliveryInfo.address.street}\n`;
    message += `Ciudad: ${deliveryInfo.address.city}\n`;
    message += `Estado: ${deliveryInfo.address.state}\n`;
    message += `Código Postal: ${deliveryInfo.address.zipCode}\n`;
    if (deliveryInfo.address.instructions) {
      message += `Instrucciones: ${deliveryInfo.address.instructions}\n`;
    }
  }
  
  message += `\n*Teléfono:* ${userInfo.phone}\n`;
  message += `*Email:* ${userInfo.email}\n`;
  
  return encodeURIComponent(message);
};

