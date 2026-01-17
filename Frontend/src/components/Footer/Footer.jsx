import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <h3>AJEET LIGHTS</h3>
            <p>
              We Light Up Your Homes with premium quality, energy-efficient
              lighting solutions since 2010.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1GQE7wKiiR/">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/ajeetlights">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com/@AJEETLIGHTS">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/profile">My Account</Link>
              </li>
              <li>
                <Link to="/cart">Shopping Cart</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Customer Service</h3>
            <ul>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq">FAQs</Link>
              </li>
              <li>
                <Link to="/shipping-policy">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/return-exchange">Return & Exchange</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact Info</h3>
            <ul>
              <li>
                <i className="fas fa-map-marker-alt"></i> 123 Lighting Street,
                Mumbai, India
              </li>
              <li>
                <i className="fas fa-phone"></i> +91 98765 43210
              </li>
              <li>
                <i className="fas fa-envelope"></i> info@ajeetlights.com
              </li>
              <li>
                <i className="fas fa-clock"></i> Mon-Sat: 9:00 AM - 8:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="copyright">
          <p>
            &copy; 2026 AJEET LIGHTS. All Rights Reserved. | Designed with{" "}
            <i className="fas fa-heart" style={{ color: "#ff4757" }}></i> by
            Codenity Team.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
