import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import {
  promoCodeService,
  shippingConfigService,
  orderService,
  userService,
} from "../../services/apiService";
import ShippingAddressModal from "../../components/ShippingAddressModal/ShippingAddressModal";
import "./Cart.css";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();
  const { currentUser, isLoggedIn } = useUser();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [shippingConfig, setShippingConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);

  useEffect(() => {
    loadShippingConfig();
    loadCashfreeSDK();
    loadSavedAddress();
  }, [currentUser]);

  const loadCashfreeSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.Cashfree) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
      document.head.appendChild(script);
    });
  };

  const loadShippingConfig = async () => {
    try {
      const response = await shippingConfigService.getShippingConfig();
      if (response.success) {
        setShippingConfig(response.data);
      }
    } catch (error) {
      console.error("Error loading shipping config:", error);
    }
  };

  const loadSavedAddress = () => {
    // First try to load from user profile
    if (currentUser) {
      const userAddress = {
        name: currentUser.name || currentUser.displayName || "",
        phoneNumber: currentUser.phoneNumber || currentUser.phone || "",
        address: currentUser.address?.street || currentUser.address || "",
        city: currentUser.address?.city || currentUser.city || "",
        state: currentUser.address?.state || currentUser.state || "",
        pincode:
          currentUser.address?.pincode ||
          currentUser.address?.zipCode ||
          currentUser.pincode ||
          "",
      };

      // Only set if at least name or address is present
      if (userAddress.name || userAddress.address) {
        setShippingAddress(userAddress);
        return;
      }
    }

    // Fallback to localStorage
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      try {
        setShippingAddress(JSON.parse(savedAddress));
      } catch (error) {
        console.error("Error loading saved address:", error);
      }
    }
  };

  const handleAddressConfirm = async (address) => {
    setShippingAddress(address);

    // Save to backend if user is logged in
    if (isLoggedIn && currentUser) {
      try {
        await userService.updateProfile({
          name: address.name,
          phoneNumber: address.phoneNumber,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        });
      } catch (error) {
        console.error("Error saving address to backend:", error);
      }
    }

    // Also save to localStorage as backup
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    setShowAddressModal(false);
    // Proceed with checkout after address is confirmed
    proceedWithCheckout(address);
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setLoading(true);
    setPromoError("");

    try {
      const response = await promoCodeService.validatePromoCode(
        promoCode.trim(),
        cartTotal,
      );

      if (response.success) {
        setAppliedPromo(response.data);
        setPromoError("");
      }
    } catch (error) {
      setPromoError(
        error.response?.data?.message || "Invalid or expired promo code",
      );
      setAppliedPromo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const handleCheckout = async () => {
    if (!isLoggedIn || !currentUser) {
      toast.warning("Please login to proceed with checkout");
      navigate("/");
      return;
    }

    if (cart.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }

    // Show address modal
    setShowAddressModal(true);
  };

  const proceedWithCheckout = async (addressData) => {
    setCheckoutLoading(true);

    try {
      const orderData = {
        shippingAddress: addressData,
        promoCode: appliedPromo?.code || "",
      };

      console.log("Order Data:", orderData);

      const orderResponse = await orderService.createOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      const order = orderResponse.data;

      // Step 2: Process payment
      const paymentResponse = await orderService.processPayment(order._id);

      if (!paymentResponse.success) {
        throw new Error(
          paymentResponse.message || "Failed to initiate payment",
        );
      }

      // Step 3: Load Cashfree and redirect
      await loadCashfreeSDK();

      const cashfree = window.Cashfree({
        mode: "sandbox", // Change to "production" for live
      });

      const checkoutOptions = {
        paymentSessionId: paymentResponse.data.paymentSessionId,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          console.error("Payment failed:", result.error);
          toast.error("Payment failed. Please try again.");
          setCheckoutLoading(false);
          return;
        }
        if (result.redirect) {
          console.log("Payment will be redirected");
          // Cart will be cleared by backend after payment verification
        }
        if (result.paymentDetails) {
          console.log("Payment completed", result.paymentDetails);
          // Redirect to order confirmation - cart will be cleared there after verification
          navigate(`/order-confirmation/${order.orderNumber}`);
        }
      });
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to process checkout. Please try again.";
      toast.error(errorMessage);
      setCheckoutLoading(false);
    }
  };

  // Calculate shipping fee
  const shippingFee =
    shippingConfig && cartTotal >= shippingConfig.freeShippingThreshold
      ? 0
      : shippingConfig?.baseShippingFee || 50;

  // Calculate discount
  const discountAmount = appliedPromo?.discountAmount || 0;

  // Calculate total
  const total = cartTotal - discountAmount + shippingFee;

  // Calculate progress for free shipping
  const amountNeededForFreeShipping = shippingConfig
    ? Math.max(0, shippingConfig.freeShippingThreshold - cartTotal)
    : 0;
  const progressPercentage = shippingConfig
    ? Math.min(100, (cartTotal / shippingConfig.freeShippingThreshold) * 100)
    : 0;

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
                    <div className="price">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </div>
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
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="summary-value">₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>
                  Shipping{" "}
                  {shippingFee === 0 ? (
                    <span className="free-tag">FREE</span>
                  ) : (
                    `₹${shippingFee.toFixed(2)} (Add ₹${amountNeededForFreeShipping.toFixed(2)} for FREE!)`
                  )}
                </span>
              </div>

              {appliedPromo && (
                <div className="summary-row discount-applied">
                  <span>
                    Discount ({appliedPromo.code})
                    <button
                      className="remove-promo-inline"
                      onClick={handleRemovePromoCode}
                      title="Remove promo code"
                    >
                      ×
                    </button>
                  </span>
                  <span className="discount-value">
                    -₹{discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-value">₹{Math.floor(total)}</span>
            </div>

            {shippingConfig &&
              cartTotal < shippingConfig.freeShippingThreshold && (
                <div className="free-shipping-progress">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    Add ₹{amountNeededForFreeShipping.toFixed(2)} more to get
                    FREE shipping!
                  </p>
                </div>
              )}

            <div className="promo-input-wrapper">
              <input
                type="text"
                placeholder="ENTER PROMO CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={appliedPromo !== null}
                onKeyPress={(e) => e.key === "Enter" && handleApplyPromoCode()}
                className="promo-input"
              />
              {!appliedPromo ? (
                <button
                  onClick={handleApplyPromoCode}
                  disabled={loading || !promoCode.trim()}
                  className="apply-btn"
                >
                  {loading ? "..." : "Apply"}
                </button>
              ) : (
                <button onClick={handleRemovePromoCode} className="apply-btn">
                  Remove
                </button>
              )}
            </div>

            {promoError && <p className="promo-error-msg">{promoError}</p>}
            {appliedPromo && (
              <p className="promo-success-msg">
                ✓ Promo code applied successfully!
              </p>
            )}

            {shippingAddress && (
              <div className="saved-address-section">
                <div className="saved-address-header">
                  <h4>Delivery Address</h4>
                  <button
                    className="edit-address-btn"
                    onClick={() => setShowAddressModal(true)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                </div>
                <div className="saved-address-content">
                  <p>
                    <strong>{shippingAddress.name}</strong>
                  </p>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} -{" "}
                    {shippingAddress.pincode}
                  </p>
                  <p>Phone: {shippingAddress.phoneNumber}</p>
                </div>
              </div>
            )}

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
            </button>

            <button className="continue-shopping-btn">
              <Link to="/products">Continue Shopping</Link>
            </button>

            <div className="security-badges">
              <div className="badge">
                <i className="fas fa-shield-alt"></i>
                <span>
                  Trusted
                  <br />
                  Security
                </span>
              </div>
              <div className="badge">
                <i className="fas fa-lock"></i>
                <span>
                  Secure
                  <br />
                  Checkout
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ShippingAddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onConfirm={handleAddressConfirm}
        initialAddress={shippingAddress}
      />
    </div>
  );
};

export default Cart;
