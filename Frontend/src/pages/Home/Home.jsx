import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { productService } from "../../services/apiService";
import "./Home.css";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        if (response.success) {
          setFeaturedProducts(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const getBadgeText = (index) => {
    if (index % 3 === 0) return "NEW";
    if (index % 3 === 1) return "BESTSELLER";
    return "SALE";
  };

  return (
    <div className="page">
      <div className="hero">
        <h2>Illuminate Your World</h2>
        <p>
          Discover our exclusive collection of premium lighting solutions that
          combine style, efficiency, and innovation to transform your living
          spaces.
        </p>
        <Link to="/products" className="btn">
          Shop Now
        </Link>
      </div>

      <h2 className="section-title center">Featured Products</h2>

      {loading ? (
        <p className="loading">Loading featured products...</p>
      ) : featuredProducts.length > 0 ? (
        <div className="products-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              badgeText={getBadgeText(index)}
            />
          ))}
        </div>
      ) : (
        <p className="no-products">No featured products available</p>
      )}

      <div className="home-sections">
        {/* <div className="home-section recent-searches">
          <h3>
            <i className="fas fa-history"></i> Recent Searches
          </h3>
          <ul>
            <li>
              LED Ceiling Lights <span className="search-count">25</span>
            </li>
            <li>
              Wall Lamps <span className="search-count">18</span>
            </li>
            <li>
              Smart Bulbs <span className="search-count">32</span>
            </li>
            <li>
              Chandeliers <span className="search-count">12</span>
            </li>
            <li>
              Outdoor Lighting <span className="search-count">21</span>
            </li>
          </ul>
        </div>

        <div className="home-section">
          <h3>
            <i className="fas fa-star"></i> Most Popular Products
          </h3>
          <div className="most-popular">
            <ul>
              <li>
                Smart LED Bulb (16W) <span className="search-count">45</span>
              </li>
              <li>
                Modern Chandelier <span className="search-count">38</span>
              </li>
              <li>
                Rechargeable Emergency Light{" "}
                <span className="search-count">42</span>
              </li>
              <li>
                LED Strip Lights <span className="search-count">29</span>
              </li>
              <li>
                Wall Sconce <span className="search-count">31</span>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="home-section offer-highlight">
          <h3>
            <i className="fas fa-gift"></i> Special Offer
          </h3>
          <div className="offer-desc">
            Get 20% off on all smart lighting products
          </div>
          <div className="offer-code">
            Use Code: <strong>LIGHTUP20</strong>
          </div>
          <p>Valid till 30th November 2023</p>
        </div>
      </div>

      <h2 className="section-title center">Why Choose AJEET LIGHTS?</h2>

      <div className="features">
        <div className="feature-card">
          <i className="fas fa-bolt"></i>
          <h3>Energy Efficient</h3>
          <p>
            Our LED lights consume up to 80% less energy than traditional bulbs.
          </p>
        </div>
        <div className="feature-card">
          <i className="fas fa-award"></i>
          <h3>Premium Quality</h3>
          <p>
            All products are certified and come with warranty for your peace of
            mind.
          </p>
        </div>
        <div className="feature-card">
          <i className="fas fa-shipping-fast"></i>
          <h3>Fast Delivery</h3>
          <p>We deliver across India within 3-7 business days.</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-headset"></i>
          <h3>24/7 Support</h3>
          <p>Our customer support team is always ready to assist you.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
