import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateOrder } from '../services/ordersService';
import { getProducts } from '../services/productsService';
import './Modal.css';
import './EditOrderModal.css';

const EditOrderModal = ({ order, onClose }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [currentItems, setCurrentItems] = useState(order.items || []);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await getProducts();
      setAvailableProducts(products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }
    const updated = [...currentItems];
    updated[index].quantity = newQuantity;
    updated[index].totalPrice = updated[index].unitPrice * newQuantity;
    setCurrentItems(updated);
  };

  const removeItem = (index) => {
    setCurrentItems(currentItems.filter((_, i) => i !== index));
  };

  const addProduct = (product) => {
    const existingIndex = currentItems.findIndex(item => item.productId === product.id);
    
    if (existingIndex >= 0) {
      updateItemQuantity(existingIndex, currentItems[existingIndex].quantity + 1);
    } else {
      const price = product.wholesalePrice && 1 >= (product.wholesaleQuantity || 4)
        ? product.wholesalePrice
        : product.price;
      
      setCurrentItems([...currentItems, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        images: product.images || []
      }]);
    }
  };

  const filteredProducts = availableProducts.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotal = () => {
    return currentItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateOrder(order.id, {
        items: currentItems,
        total: calculateTotal()
      });
      onClose();
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      alert('Error al actualizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <h2>Editar Pedido #{order.orderId?.substring(6) || order.id}</h2>
        </div>

        <div className="edit-order-tabs">
          <button
            className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Productos Actuales
          </button>
          <button
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Agregar Productos
          </button>
        </div>

        <div className="edit-order-body">
          {activeTab === 'current' ? (
            <div className="current-items">
              {currentItems.length === 0 ? (
                <p className="empty-message">No hay productos en el pedido</p>
              ) : (
                <>
                  {currentItems.map((item, index) => (
                    <div key={index} className="edit-item">
                      <img 
                        src={item.images?.[0] || '/placeholder.jpg'} 
                        alt={item.name}
                        className="edit-item-image"
                      />
                      <div className="edit-item-info">
                        <h4>{item.name}</h4>
                        <p>${item.unitPrice.toFixed(2)} c/u</p>
                      </div>
                      <div className="edit-item-actions">
                        <div className="quantity-controls">
                          <button onClick={() => updateItemQuantity(index, item.quantity - 1)}>
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(index, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                        <p className="item-subtotal">${item.totalPrice.toFixed(2)}</p>
                        <button className="remove-btn" onClick={() => removeItem(index)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="add-products">
              <div className="search-products">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card-small" onClick={() => addProduct(product)}>
                    <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
                    <h4>{product.name}</h4>
                    <p>${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="edit-order-footer">
          <div className="order-total">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="edit-actions">
            <button className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;

