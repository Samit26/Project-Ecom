import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../services/apiService";
import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      showNotification(`${product.name} added to cart!`);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

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

  if (loading) {
    return <div className="page loading-container">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="page">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <button className="btn" onClick={() => navigate("/products")}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page product-detail-page">
      <button className="back-btn" onClick={() => navigate("/products")}>
        <i className="fas fa-arrow-left"></i> Back to Products
      </button>

      <div className="product-detail">
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={product.images?.[selectedImage] || "/placeholder.jpg"}
              alt={product.name}
            />
            {product.stock === "not available" && (
              <div className="out-of-stock-badge">Out of Stock</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImage === index ? "active" : ""}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-details-info">
          <div className="product-category">{product.category}</div>
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            {generateStarRating(product.rating)}
            <span className="rating-text">({product.rating} / 5)</span>
          </div>

          <div className="product-pricing">
            {product.pricing?.originalPrice > product.pricing?.offerPrice && (
              <span className="original-price">
                ₹{product.pricing.originalPrice}
              </span>
            )}
            <span className="offer-price">₹{product.pricing?.offerPrice}</span>
            {product.pricing?.originalPrice > product.pricing?.offerPrice && (
              <span className="discount">
                {Math.round(
                  ((product.pricing.originalPrice -
                    product.pricing.offerPrice) /
                    product.pricing.originalPrice) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>

          <div className="product-stock">
            <span
              className={`stock-status ${
                product.stock === "available" ? "in-stock" : "out-of-stock"
              }`}
            >
              {product.stock === "available" ? (
                <>
                  <i className="fas fa-check-circle"></i> In Stock
                </>
              ) : (
                <>
                  <i className="fas fa-times-circle"></i> Out of Stock
                </>
              )}
            </span>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-actions-detail">
            <button
              className="btn add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock !== "available"}
            >
              <i className="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default ProductDetail;
