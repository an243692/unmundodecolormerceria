import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Shield, Truck, MessageCircle } from 'lucide-react';
import { getProducts } from '../services/productsService';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Bienvenido a Un Mundo de Color</h1>
            <p className="hero-subtitle">
              Tu tienda de confianza para productos de calidad
            </p>
            <div className="hero-badges">
              <span className="badge">
                <Shield size={16} />
                Pago Seguro
              </span>
              <span className="badge">
                <Truck size={16} />
                Envío Rápido
              </span>
            </div>
            <div className="hero-actions">
              <Link to="/productos" className="btn btn-primary">
                Ver Catálogo
              </Link>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <MessageCircle size={18} />
                Contactar por WhatsApp
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="logo-large">
              <ShoppingCart size={120} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <section className="features-section">
        <div className="features-carousel">
          <div className="feature-item">
            <Shield size={32} />
            <span>Pagos Seguros</span>
          </div>
          <div className="feature-item">
            <span>💳</span>
            <span>Stripe Payments</span>
          </div>
          <div className="feature-item">
            <Truck size={32} />
            <span>Envíos Gratis</span>
          </div>
          <div className="feature-item">
            <MessageCircle size={32} />
            <span>Pedidos WhatsApp</span>
          </div>
          <div className="feature-item">
            <Shield size={32} />
            <span>Compra Segura</span>
          </div>
          <div className="feature-item">
            <Truck size={32} />
            <span>Entregas Rápidas</span>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <h2 className="products-section-title">Nuestros Productos</h2>
              <div className="products-grid-home">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-products">
              <p>No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Home;

