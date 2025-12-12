import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutModal from './CheckoutModal';
import './Modal.css';
import './CartModal.css';

const CartModal = ({ onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return <CheckoutModal onClose={() => setShowCheckout(false)} onBack={() => setShowCheckout(false)} />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="empty-cart">
            <ShoppingBag size={64} />
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para comenzar</p>
            <button className="btn btn-primary" onClick={onClose}>
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <h2>Carrito de Compras</h2>
          <button className="clear-cart-btn" onClick={clearCart}>
            Vaciar Carrito
          </button>
        </div>

        <div className="cart-items">
          {cartItems.map((item) => {
            const price = item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
              ? item.wholesalePrice
              : item.price;
            const subtotal = price * item.quantity;

            return (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.images?.[0] || '/placeholder.jpg'} 
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">${price.toFixed(2)} c/u</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="cart-item-subtotal">${subtotal.toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span className="total-amount">${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="cart-actions">
            <button className="btn btn-outline" onClick={onClose}>
              Seguir Comprando
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                if (!user) {
                  alert('Por favor inicia sesión para continuar');
                  return;
                }
                setShowCheckout(true);
              }}
            >
              Proceder al Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;

