import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { cleanupAbandonedOrders } from './services/ordersService';
import './App.css';

function App() {
  // Limpiar pedidos abandonados cada 5 minutos
  useEffect(() => {
    const cleanupInterval = setInterval(async () => {
      try {
        await cleanupAbandonedOrders();
      } catch (error) {
        console.error('Error al limpiar pedidos abandonados:', error);
      }
    }, 5 * 60 * 1000); // 5 minutos

    // Ejecutar una vez al cargar
    cleanupAbandonedOrders().catch(console.error);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Products />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#28a745',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#dc3545',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

