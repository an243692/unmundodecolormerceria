import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Un Mundo de Color</h3>
            <p>
              Tu tienda de confianza para productos de calidad. 
              Ofrecemos los mejores precios y servicio al cliente.
            </p>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Métodos de Pago</h4>
            <div className="payment-methods">
              <span>💳 Tarjeta de Crédito</span>
              <span>💳 Tarjeta de Débito</span>
              <span>📱 Stripe</span>
              <span>💬 WhatsApp</span>
            </div>
          </div>

          <div className="footer-section">
            <h4>Contacto</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={18} />
                <span>(123) 456-7890</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>contacto@unmundodecolor.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>Las Cruces No 40, Col. Centro</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><a href="/productos">Productos</a></li>
              <li><a href="/admin">Panel Admin</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
              <li><a href="#">Política de Privacidad</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.1234567890!2d-99.1234567!3d19.4326083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI1JzU3LjQiTiA5OcKwMDcnMjQuNCJX!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de la tienda"
          ></iframe>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Un Mundo de Color. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

