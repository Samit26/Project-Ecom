import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, badgeText }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [notification, setNotification] = useState("");

  const generateStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }

    return stars;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    showNotification(`${product.name} added to cart!`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id || product.id}`);
  };

  // Get the first image from images array or fallback
  const productImage =
    product.images?.[0] || product.image || "/placeholder.jpg";

  // Get price from pricing object or fallback to direct price
  const displayPrice = product.pricing?.offerPrice || product.price;
  const originalPrice = product.pricing?.originalPrice || product.oldPrice;

  return (
    <>
      <div className="product-card" onClick={handleCardClick}>
        {badgeText && <div className="product-badge">{badgeText}</div>}
        <div className="product-image">
          <img src={productImage} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="rating">
            {generateStarRating(product.rating || 0)}
            <span className="rating-value">({product.rating || 0})</span>
          </div>
          <div className="price">
            {originalPrice && originalPrice > displayPrice && (
              <span className="old-price">₹{originalPrice}</span>
            )}
            <span className="current-price">₹{displayPrice}</span>
          </div>
          <p className="product-description">
            {product.description?.length > 80
              ? product.description.substring(0, 80) + "..."
              : product.description}
          </p>
          <div className="product-actions">
            <button
              className="add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock === "not available"}
            >
              {product.stock === "not available"
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {notification && <div className="notification">{notification}</div>}
    </>
  );
};

export default ProductCard;
