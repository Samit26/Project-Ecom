import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } =
    useCart();

  const shipping = 200;
  const tax = cartTotal * 0.18;
  const discount = 500;
  const total = cartTotal + shipping + tax - discount;

  return (
    <div className="page">
      <h1 className="section-title">Shopping Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          <h2>
            Your Cart Items (<span>{cartCount}</span>)
          </h2>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
              <Link to="/products" className="btn">
                Browse Products
              </Link>
            </div>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <div className="price">₹{item.price}</div>
                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <div
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: "700", fontSize: "1.2rem" }}>
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="summary-row">
              <span>Tax (18%)</span>
              <span>₹{Math.round(tax)}</span>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{Math.round(total)}</span>
            </div>

            <div className="form-group" style={{ marginTop: "30px" }}>
              <button className="btn btn-blue" style={{ width: "100%" }}>
                Proceed to Checkout
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link to="/products">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
