import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/ordersService';
import { createCheckoutSession, generateWhatsAppMessage } from '../services/stripeService';
import './Modal.css';
import './CheckoutModal.css';

const CheckoutModal = ({ onClose, onBack }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [deliveryInfo, setDeliveryInfo] = useState({
    store: 'Las Cruces No 40, Col. Centro',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);

  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
  };

  const handleDeliveryInfoChange = (field, value) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [field]: value
    });
  };

  const validateDeliveryInfo = () => {
    if (deliveryType === 'delivery') {
      if (!deliveryInfo.street || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.zipCode) {
        return false;
      }
    }
    return true;
  };

  const handleWhatsAppOrder = async () => {
    if (!validateDeliveryInfo()) {
      alert('Por favor completa todos los campos de entrega');
      return;
    }

    setLoading(true);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const total = getCartTotal();

      const orderData = {
        orderId,
        userId: user.uid,
        userInfo: {
          fullName: userProfile?.fullName || user.displayName || 'Usuario',
          email: user.email,
          phone: userProfile?.phone || '',
          address: userProfile?.address || ''
        },
        items: cartItems.map(item => {
          const price = item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
            ? item.wholesalePrice
            : item.price;
          return {
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: price,
            totalPrice: price * item.quantity,
            images: item.images || []
          };
        }),
        total,
        paymentMethod: 'whatsapp',
        deliveryInfo: {
          type: deliveryType,
          address: deliveryType === 'pickup' 
            ? { store: deliveryInfo.store }
            : {
                street: deliveryInfo.street,
                city: deliveryInfo.city,
                state: deliveryInfo.state,
                zipCode: deliveryInfo.zipCode,
                instructions: deliveryInfo.instructions
              }
        }
      };

      // Guardar pedido en Firebase
      await createOrder(orderData);

      // Generar mensaje de WhatsApp
      const message = generateWhatsAppMessage(orderData);
      const whatsappUrl = `https://wa.me/1234567890?text=${message}`;
      
      // Limpiar carrito
      clearCart();
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
      
      onClose();
      alert('Pedido creado. Redirigiendo a WhatsApp...');
    } catch (error) {
      console.error('Error al crear pedido:', error);
      alert('Error al crear el pedido. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    if (!validateDeliveryInfo()) {
      alert('Por favor completa todos los campos de entrega');
      return;
    }

    setLoading(true);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const total = getCartTotal();

      const items = cartItems.map(item => {
        const price = item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
          ? item.wholesalePrice
          : item.price;
        return {
          name: item.name,
          unitPrice: price,
          quantity: item.quantity,
          images: item.images || []
        };
      });

      const orderData = {
        orderId,
        userId: user.uid,
        userInfo: {
          fullName: userProfile?.fullName || user.displayName || 'Usuario',
          email: user.email,
          phone: userProfile?.phone || '',
          address: userProfile?.address || ''
        },
        items: cartItems.map(item => {
          const price = item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
            ? item.wholesalePrice
            : item.price;
          return {
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: price,
            totalPrice: price * item.quantity,
            images: item.images || []
          };
        }),
        total,
        paymentMethod: 'card',
        deliveryInfo: {
          type: deliveryType,
          address: deliveryType === 'pickup' 
            ? { store: deliveryInfo.store }
            : {
                street: deliveryInfo.street,
                city: deliveryInfo.city,
                state: deliveryInfo.state,
                zipCode: deliveryInfo.zipCode,
                instructions: deliveryInfo.instructions
              }
        }
      };

      // Guardar pedido en Firebase antes de redirigir
      await createOrder(orderData);

      // Crear sesión de Stripe
      const checkoutUrl = await createCheckoutSession(items, orderId, orderData.userInfo, user.uid);
      
      // Redirigir a Stripe
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al procesar el pago. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        {onBack && (
          <button className="modal-back" onClick={onBack}>
            <ArrowLeft size={20} />
            Volver
          </button>
        )}

        <div className="modal-header">
          <h2>Finalizar Pedido</h2>
        </div>

        <div className="checkout-body">
          <div className="checkout-section">
            <h3>Información de Entrega</h3>
            
            <div className="delivery-options">
              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryType"
                  value="pickup"
                  checked={deliveryType === 'pickup'}
                  onChange={(e) => handleDeliveryTypeChange(e.target.value)}
                />
                <span>Recoger en tienda</span>
              </label>
              
              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryType"
                  value="delivery"
                  checked={deliveryType === 'delivery'}
                  onChange={(e) => handleDeliveryTypeChange(e.target.value)}
                />
                <span>Envío a domicilio</span>
              </label>
            </div>

            {deliveryType === 'pickup' ? (
              <div className="form-group">
                <label>Tienda</label>
                <input
                  type="text"
                  value={deliveryInfo.store}
                  disabled
                  className="disabled-input"
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="street">Calle *</label>
                  <input
                    type="text"
                    id="street"
                    value={deliveryInfo.street}
                    onChange={(e) => handleDeliveryInfoChange('street', e.target.value)}
                    required
                    placeholder="Calle y número"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">Ciudad *</label>
                    <input
                      type="text"
                      id="city"
                      value={deliveryInfo.city}
                      onChange={(e) => handleDeliveryInfoChange('city', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">Estado *</label>
                    <input
                      type="text"
                      id="state"
                      value={deliveryInfo.state}
                      onChange={(e) => handleDeliveryInfoChange('state', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="zipCode">Código Postal *</label>
                  <input
                    type="text"
                    id="zipCode"
                    value={deliveryInfo.zipCode}
                    onChange={(e) => handleDeliveryInfoChange('zipCode', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="instructions">Instrucciones de entrega (opcional)</label>
                  <textarea
                    id="instructions"
                    value={deliveryInfo.instructions}
                    onChange={(e) => handleDeliveryInfoChange('instructions', e.target.value)}
                    placeholder="Ej: Llamar antes de llegar"
                    rows="3"
                  />
                </div>
              </>
            )}
          </div>

          <div className="checkout-section">
            <h3>Resumen del Pedido</h3>
            <div className="order-summary">
              {cartItems.map((item) => {
                const price = item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
                  ? item.wholesalePrice
                  : item.price;
                return (
                  <div key={item.id} className="summary-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="summary-total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h3>Método de Pago</h3>
            <div className="payment-methods">
              <button
                className="payment-btn whatsapp-btn"
                onClick={handleWhatsAppOrder}
                disabled={loading}
              >
                Ordenar por WhatsApp
              </button>
              <button
                className="payment-btn stripe-btn"
                onClick={handleStripePayment}
                disabled={loading}
              >
                Pagar con Tarjeta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

