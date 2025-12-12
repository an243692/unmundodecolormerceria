import React, { useState, useEffect } from 'react';
import { X, Edit, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, updateOrder } from '../services/ordersService';
import EditOrderModal from './EditOrderModal';
import './Modal.css';
import './OrderHistoryModal.css';

const OrderHistoryModal = ({ onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'var(--success)';
      case 'cancelled':
        return 'var(--error)';
      default:
        return 'var(--warning)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  };

  if (showEditModal && selectedOrder) {
    return (
      <EditOrderModal
        order={selectedOrder}
        onClose={() => {
          setShowEditModal(false);
          setSelectedOrder(null);
          loadOrders();
        }}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <h2>Historial de Pedidos</h2>
        </div>

        <div className="order-history-body">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <p>No tienes pedidos aún</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h4>Pedido #{order.orderId?.substring(6) || order.id}</h4>
                      <p className="order-date">
                        {new Date(order.timestamp).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span>${order.total?.toFixed(2)}</span>
                    </div>
                    <div className="order-actions">
                      {order.status === 'pending' && (
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                      )}
                      <button className="action-btn view-btn">
                        <Eye size={16} />
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryModal;

