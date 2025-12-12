import React, { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const handleImageError = () => {
    setImageError(true);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container" onClick={handleViewDetails}>
        {!imageError && images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              onError={handleImageError}
              className="product-image"
            />
            {hasMultipleImages && (
              <>
                <button className="image-nav prev" onClick={prevImage}>
                  ‹
                </button>
                <button className="image-nav next" onClick={nextImage}>
                  ›
                </button>
                <div className="image-indicators">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={index === currentImageIndex ? 'active' : ''}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="product-image-placeholder">
            <ShoppingCart size={48} />
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="low-stock-badge">Últimas {product.stock} unidades</span>
        )}
        {product.stock === 0 && (
          <span className="out-of-stock-badge">Agotado</span>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">
          <span className="category-icon">🏷️</span>
          {product.category}
        </div>
        
        <h3 className="product-name" onClick={handleViewDetails}>
          {product.name}
        </h3>

        <div className="product-pricing">
          <div className="price-row">
            <span className="price-label">Individual:</span>
            <span className="price">${product.price?.toFixed(2)}</span>
          </div>
          {product.wholesalePrice && (
            <div className="price-row">
              <span className="price-label">Mayoreo (min. {product.wholesaleQuantity || 4}):</span>
              <span className="wholesale-price">${product.wholesalePrice?.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="product-stock">
          <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
          </span>
        </div>

        <div className="product-actions">
          <button
            className="btn btn-secondary view-btn"
            onClick={handleViewDetails}
          >
            <Eye size={18} />
            Ver Detalles
          </button>
          <button
            className="btn btn-primary cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={18} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

