import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, User, LogOut, History, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ProfileModal from './ProfileModal';
import CartModal from './CartModal';
import OrderHistoryModal from './OrderHistoryModal';
import './Header.css';

const Header = () => {
  const { user, userProfile, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/productos?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="logo">
              <h1>Un Mundo de Color</h1>
            </Link>
          </div>

          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <Search size={20} />
            </button>
          </form>

          <div className="header-right">
            <div className="contact-info">
              <span>📞 (123) 456-7890</span>
            </div>

            {user ? (
              <div className="user-menu">
                <button 
                  className="user-btn"
                  onClick={() => setShowProfile(true)}
                  title="Perfil"
                >
                  <User size={20} />
                  <span className="user-name">{userProfile?.fullName || user.displayName || 'Usuario'}</span>
                </button>
                <button 
                  className="history-btn"
                  onClick={() => setShowHistory(true)}
                  title="Historial"
                >
                  <History size={20} />
                </button>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                className="login-btn"
                onClick={() => setShowLogin(true)}
              >
                Iniciar Sesión
              </button>
            )}

            <button 
              className="cart-btn"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={20} />
              {getCartItemsCount() > 0 && (
                <span className="cart-badge">{getCartItemsCount()}</span>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            {!user && (
              <button onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}>
                Iniciar Sesión
              </button>
            )}
            {user && (
              <>
                <button onClick={() => { setShowProfile(true); setMobileMenuOpen(false); }}>
                  Perfil
                </button>
                <button onClick={() => { setShowHistory(true); setMobileMenuOpen(false); }}>
                  Historial
                </button>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
      {showHistory && <OrderHistoryModal onClose={() => setShowHistory(false)} />}
    </>
  );
};

export default Header;

