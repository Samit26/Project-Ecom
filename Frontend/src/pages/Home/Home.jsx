import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { productService, promoCodeService } from "../../services/apiService";
import "./Home.css";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homePromoCode, setHomePromoCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productResponse = await productService.getFeaturedProducts();
        if (productResponse.success) {
          setFeaturedProducts(productResponse.data.slice(0, 4));
        }

        // Fetch homepage promo code
        const promoResponse = await promoCodeService.getHomePagePromoCode();
        if (promoResponse.success && promoResponse.data) {
          setHomePromoCode(promoResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
        {homePromoCode && (
          <div className="home-section offer-highlight">
            <div className="offer-badge">
              <i className="fas fa-gift"></i>
            </div>
            <h3>Special Offer</h3>
            <div className="offer-desc">{homePromoCode.description}</div>
            <div className="offer-code">
              Use Code: <strong>{homePromoCode.code}</strong>
            </div>
            <div className="offer-details">
              {homePromoCode.discountType === "percentage" ? (
                <span className="discount-value">
                  {homePromoCode.discountValue}% OFF
                </span>
              ) : (
                <span className="discount-value">
                  ₹{homePromoCode.discountValue} OFF
                </span>
              )}
              {homePromoCode.minOrderAmount > 0 && (
                <span className="min-order">
                  Min. order: ₹{homePromoCode.minOrderAmount}
                </span>
              )}
            </div>
            <p className="offer-validity">
              Valid till {formatDate(homePromoCode.validUntil)}
            </p>
          </div>
        )}
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
