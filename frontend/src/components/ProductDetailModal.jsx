import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Modal.css';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product.images || [];
  const price = product.wholesalePrice && quantity >= (product.wholesaleQuantity || 4)
    ? product.wholesalePrice
    : product.price;

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="product-detail-content">
          <div className="product-detail-images">
            <div className="main-image">
              <img
                src={images[currentImageIndex] || '/placeholder.jpg'}
                alt={product.name}
              />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-images">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={index === currentImageIndex ? 'active' : ''}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <div className="breadcrumb">
              <span>Inicio</span>
              <span>›</span>
              <span>{product.category}</span>
              <span>›</span>
              <span>{product.name}</span>
            </div>

            <h1 className="product-detail-name">{product.name}</h1>

            {product.brand && (
              <p className="product-brand">Marca: {product.brand}</p>
            )}

            {product.sku && (
              <p className="product-sku">SKU: {product.sku}</p>
            )}

            <div className="product-detail-pricing">
              <div className="price-section">
                <span className="price-label">Precio Individual:</span>
                <span className="price-main">${product.price?.toFixed(2)}</span>
              </div>
              {product.wholesalePrice && (
                <div className="price-section">
                  <span className="price-label">
                    Precio Mayoreo (min. {product.wholesaleQuantity || 4} unidades):
                  </span>
                  <span className="wholesale-price-main">${product.wholesalePrice?.toFixed(2)}</span>
                </div>
              )}
              {quantity >= (product.wholesaleQuantity || 4) && product.wholesalePrice && (
                <div className="wholesale-badge">
                  Aplicando precio mayoreo
                </div>
              )}
            </div>

            <div className="product-detail-stock">
              <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product.stock > 0 ? `Stock disponible: ${product.stock} unidades` : 'Sin stock'}
              </span>
            </div>

            <div className="product-detail-description">
              <h3>Descripción</h3>
              <p>{product.description || 'Sin descripción disponible.'}</p>
            </div>

            <div className="product-detail-actions">
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="quantity-btn"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="quantity-total">
                  Total: ${(price * quantity).toFixed(2)}
                </span>
              </div>

              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={20} />
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

