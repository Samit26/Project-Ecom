import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { orderService } from "../../services/apiService";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      verifyAndLoadOrder();
    }
  }, [orderNumber]);

  const verifyAndLoadOrder = async () => {
    try {
      setVerifying(true);

      // Find order by order number
      const ordersResponse = await orderService.getUserOrders();
      if (ordersResponse.success) {
        const foundOrder = ordersResponse.data.find(
          (o) => o.orderNumber === orderNumber,
        );

        if (foundOrder) {
          // Only verify payment if it's not already completed
          if (foundOrder.paymentStatus !== "completed") {
            try {
              const verifyResponse = await orderService.verifyPayment(
                foundOrder._id,
              );
              if (verifyResponse.success) {
                // Reload orders to get updated payment status
                const updatedOrdersResponse =
                  await orderService.getUserOrders();
                if (updatedOrdersResponse.success) {
                  const updatedOrder = updatedOrdersResponse.data.find(
                    (o) => o.orderNumber === orderNumber,
                  );
                  if (updatedOrder) {
                    setOrder(updatedOrder);
                  } else {
                    setOrder(foundOrder);
                  }
                } else {
                  setOrder(foundOrder);
                }
              } else {
                setOrder(foundOrder);
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              setOrder(foundOrder);
            }
          } else {
            // Payment already completed, just use the found order
            setOrder(foundOrder);
          }
        }
      }
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="order-confirmation">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <div className="order-confirmation">
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <h2>Order Not Found</h2>
            <p>We couldn't find the order you're looking for.</p>
            <Link to="/products" className="btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaymentFailed =
    order.paymentStatus === "failed" || order.paymentStatus === "pending";
  const isPaymentSuccess = order.paymentStatus === "completed";

  return (
    <div className="page">
      <div className="order-confirmation">
        {isPaymentFailed ? (
          <div className="failed-header">
            <div className="failed-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <h1>Order Failed</h1>
            <p className="order-number">Order Number: #{order.orderNumber}</p>
            <div className="failed-message">
              <p>
                Your payment could not be processed successfully.
                {order.paymentStatus === "pending"
                  ? " The payment is still pending."
                  : " The transaction was cancelled or failed."}
              </p>
              <p className="refund-notice">
                <i className="fas fa-info-circle"></i>
                If any amount was deducted from your account, it will be
                refunded within 5-7 business days. For any concerns, please{" "}
                <Link to="/contact">contact us</Link>.
              </p>
              <Link to="/cart" className="btn btn-primary retry-btn">
                <i className="fas fa-redo"></i>
                Try Again
              </Link>
            </div>
          </div>
        ) : (
          <div className="success-header">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-number">Order Number: #{order.orderNumber}</p>
          </div>
        )}

        {verifying && (
          <div className="verification-notice">
            <i className="fas fa-info-circle"></i>
            <span>Verifying payment status...</span>
          </div>
        )}

        <div className="order-summary-card">
          <h2>Order Summary</h2>

          <div className="order-details-grid">
            <div className="detail-row">
              <span className="label">Order Status:</span>
              <span className="value status">
                <span className={`status-badge ${order.orderStatus}`}>
                  {order.orderStatus}
                </span>
              </span>
            </div>

            <div className="detail-row">
              <span className="label">Payment Status:</span>
              <span className="value">
                <span className={`status-badge ${order.paymentStatus}`}>
                  {order.paymentStatus}
                </span>
              </span>
            </div>

            <div className="detail-row">
              <span className="label">Order Date:</span>
              <span className="value">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="detail-row">
              <span className="label">Total Amount:</span>
              <span className="value price">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="order-items-card">
          <h3>Items Ordered ({order.items.length})</h3>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  <img src={item.image || "/placeholder.png"} alt={item.name} />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.promoCodeDiscount > 0 && (
              <div className="total-row discount">
                <span>Discount:</span>
                <span>-₹{order.promoCodeDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row">
              <span>Shipping:</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="free-badge">FREE</span>
                ) : (
                  `₹${order.shippingFee.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="shipping-address-card">
          <h3>Shipping Address</h3>
          <div className="address-details">
            <p>
              <strong>{order.shippingAddress.name}</strong>
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
            <p>Phone: {order.shippingAddress.phoneNumber}</p>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/profile" className="btn btn-secondary">
            <i className="fas fa-user"></i>
            View All Orders
          </Link>
          <Link to="/products" className="btn btn-primary">
            <i className="fas fa-shopping-bag"></i>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
