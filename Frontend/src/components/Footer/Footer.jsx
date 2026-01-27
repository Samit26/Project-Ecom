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
              lighting solutions since 2025.
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
                <i className="fas fa-map-marker-alt"></i>Add: 406, Apeksha
                Nagar, Bamroli Road, Pandesara, Surat - 394221
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>Office: FF-11, Anaya
                Business Center, Nr. D-Mart, VIP Road, Pandesara, Surat - 394221
              </li>
              <li>
                <i className="fas fa-phone"></i> +91 7405162060 / 9427766113
              </li>
              <li>
                <i className="fas fa-envelope"></i> ajeetlights@gmail.com
              </li>
              <li>
                <i className="fas fa-clock"></i> Mon-Fri:9:30am to 7:00pm <br />
                Sat : 9:30am to 6:00pm
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
