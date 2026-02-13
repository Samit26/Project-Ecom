import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState(null);

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
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate("/cart");
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
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
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <Link to="/products">{product.category?.name || "Products"}</Link>
        <span className="separator">/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Product Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={product.images?.[selectedImage] || "/placeholder.jpg"}
              alt={product.name}
            />
            {product.stock === "not available" && (
              <div className="out-of-stock-badge">Out of Stock</div>
            )}
            {/* Mobile Navigation Buttons */}
            {product.images && product.images.length > 1 && (
              <>
                <div className="main-image-nav prev">
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev > 0 ? prev - 1 : product.images.length - 1,
                      )
                    }
                    aria-label="Previous image"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </div>
                <div className="main-image-nav next">
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev < product.images.length - 1 ? prev + 1 : 0,
                      )
                    }
                    aria-label="Next image"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-carousel">
              <button
                className="carousel-btn prev"
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev > 0 ? prev - 1 : product.images.length - 1,
                  )
                }
              >
                <i className="fas fa-chevron-left"></i>
              </button>
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
              <button
                className="carousel-btn next"
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev < product.images.length - 1 ? prev + 1 : 0,
                  )
                }
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
          {/* Dots indicator for mobile */}
          {product.images && product.images.length > 1 && (
            <div className="carousel-dots">
              {product.images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                ></span>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating-review">
            <div className="stars">{generateStarRating(product.rating)}</div>
          </div>

          <div className="product-pricing">
            <span className="current-price">
              ₹{product.pricing?.offerPrice}
            </span>
            {product.pricing?.originalPrice > product.pricing?.offerPrice && (
              <>
                <span className="original-price">
                  ₹{product.pricing.originalPrice}
                </span>
                <span className="discount-badge">
                  {Math.round(
                    ((product.pricing.originalPrice -
                      product.pricing.offerPrice) /
                      product.pricing.originalPrice) *
                      100,
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>

          <div className="product-short-description">
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label>Quantity</label>
            <div className="quantity-selector">
              <button className="qty-btn" onClick={decrementQuantity}>
                <i className="fas fa-minus"></i>
              </button>
              <input type="number" value={quantity} readOnly />
              <button className="qty-btn" onClick={incrementQuantity}>
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock !== "available"}
            >
              Add to Cart
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock !== "available"}
            >
              Buy It Now
            </button>
          </div>

          {/* Collapsible Sections */}
          <div className="collapsible-sections">
            <div className="section-item">
              <button
                className="section-header"
                onClick={() => toggleSection("details")}
              >
                <span>Product Details</span>
                <i
                  className={`fas fa-chevron-${expandedSection === "details" ? "up" : "down"}`}
                ></i>
              </button>
              {expandedSection === "details" && (
                <div className="section-content">
                  <p>{product.description}</p>
                  {product.features && (
                    <ul>
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="section-item">
              <button
                className="section-header"
                onClick={() => toggleSection("specifications")}
              >
                <span>Specifications</span>
                <i
                  className={`fas fa-chevron-${expandedSection === "specifications" ? "up" : "down"}`}
                ></i>
              </button>
              {expandedSection === "specifications" && (
                <div className="section-content">
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <td>Category</td>
                        <td>{product.category?.name || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>Stock Status</td>
                        <td>
                          {product.stock === "available"
                            ? "In Stock"
                            : "Out of Stock"}
                        </td>
                      </tr>
                      {product.specifications &&
                        Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <tr key={key}>
                              <td>{key}</td>
                              <td>{value}</td>
                            </tr>
                          ),
                        )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="section-item">
              <button
                className="section-header"
                onClick={() => toggleSection("shipping")}
              >
                <span>Shipping & Returns</span>
                <i
                  className={`fas fa-chevron-${expandedSection === "shipping" ? "up" : "down"}`}
                ></i>
              </button>
              {expandedSection === "shipping" && (
                <div className="section-content">
                  <p>
                    <strong>Delivery Time:</strong> 5-7 business days
                  </p>
                  <p>
                    <strong>Returns:</strong> 7-day return policy. Items must be
                    unused and in original packaging.
                  </p>
                  <p>
                    <strong>Refunds:</strong> Processed within 5-7 business days
                    after receiving the returned item.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
