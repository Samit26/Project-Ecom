import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { orderService, userService } from "../../services/apiService";
import "./Profile.css";

const Profile = () => {
  const { currentUser, isLoggedIn } = useUser();
  const { wishlist, addToCart, toggleWishlist } = useCart();
  const [activeSection, setActiveSection] = useState(
    isLoggedIn ? "profile" : "orders",
  );
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // Fetch user orders when component mounts or user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  // Update form data when current user changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        address: {
          street: currentUser.address?.street || "",
          city: currentUser.address?.city || "",
          state: currentUser.address?.state || "",
          zipCode: currentUser.address?.zipCode || "",
        },
      });
    }
  }, [currentUser]);

  // Reset to page 1 when switching to orders section
  useEffect(() => {
    if (activeSection === "orders") {
      setCurrentPage(1);
    }
  }, [activeSection]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getUserOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      // Remove hyphens and formatting from phone number before sending
      const dataToSend = {
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/[-\s()]/g, ""),
      };
      const response = await userService.updateProfile(dataToSend);
      if (response.success) {
        // Update local storage with new user data
        const updatedUser = response.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update the form data with the response data to reflect any backend changes
        setFormData({
          name: updatedUser.name || "",
          phoneNumber: updatedUser.phoneNumber || "",
          address: {
            street: updatedUser.address?.street || "",
            city: updatedUser.address?.city || "",
            state: updatedUser.address?.state || "",
            zipCode: updatedUser.address?.zipCode || "",
          },
        });

        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatOrderStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="page">
      <h1 className="section-title">My Account</h1>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h3>{currentUser ? currentUser.name : "Guest User"}</h3>
            <p>
              {currentUser ? currentUser.email : "Login to view your account"}
            </p>
          </div>

          <div className="profile-nav">
            <ul>
              {isLoggedIn && (
                <li>
                  <a
                    href="#"
                    className={activeSection === "profile" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("profile");
                    }}
                  >
                    My Profile
                  </a>
                </li>
              )}
              <li>
                <a
                  href="#"
                  className={activeSection === "orders" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection("orders");
                  }}
                >
                  My Orders
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="profile-content">
          {/* Profile Section */}
          {activeSection === "profile" && isLoggedIn && (
            <div className="profile-section">
              <h2>My Profile</h2>
              <p>View and update your personal information</p>

              {error && (
                <div style={{ color: "red", marginBottom: "15px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={currentUser?.email || ""}
                    disabled
                    style={{
                      backgroundColor: "#0f0f0fff",
                      color: "#ffffffff",
                      cursor: "not-allowed",
                    }}
                  />
                  <small style={{ color: "#666" }}>
                    Email cannot be changed
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>
                  Address
                </h3>

                <div className="form-group">
                  <label htmlFor="address.street">Street Address</label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    placeholder="Enter street address"
                    value={formData.address.street}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.city">City</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    placeholder="Enter city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.state">State</label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    placeholder="Enter state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    placeholder="Enter ZIP code"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <div className="profile-section">
              <h2>My Orders</h2>
              <p>View and track your orders</p>

              {loading && <p>Loading orders...</p>}
              {error && (
                <div style={{ color: "red", marginBottom: "15px" }}>
                  {error}
                </div>
              )}

              {!loading && orders.length > 0 && (
                <div className="orders-summary">
                  <p>
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * ordersPerPage + 1,
                      orders.length,
                    )}{" "}
                    - {Math.min(currentPage * ordersPerPage, orders.length)} of{" "}
                    {orders.length} orders
                  </p>
                </div>
              )}

              <div className="order-list">
                {!loading && orders.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#666",
                      padding: "40px",
                    }}
                  >
                    No orders yet
                  </p>
                ) : (
                  orders
                    .slice(
                      (currentPage - 1) * ordersPerPage,
                      currentPage * ordersPerPage,
                    )
                    .map((order) => (
                      <div key={order._id} className="order-card">
                        <div style={{ flex: 1 }}>
                          <h3 style={{ marginBottom: "5px" }}>
                            Order #{order._id.slice(-8)}
                          </h3>
                          <div style={{ color: "#666", marginBottom: "10px" }}>
                            Placed on {formatDate(order.createdAt)} •{" "}
                            {order.items.length} item(s)
                          </div>
                          <div
                            className={`order-status status-${order.orderStatus}`}
                          >
                            {formatOrderStatus(order.orderStatus)}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontWeight: "700",
                              fontSize: "1.2rem",
                              marginBottom: "10px",
                            }}
                          >
                            ₹{order.totalAmount}
                          </div>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "#666",
                              marginBottom: "10px",
                            }}
                          >
                            Payment: {formatOrderStatus(order.paymentStatus)}
                          </div>
                          <button
                            className="btn"
                            style={{ padding: "8px 15px", fontSize: "0.9rem" }}
                            onClick={() =>
                              (window.location.href = `/order-confirmation/${order.orderNumber}`)
                            }
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Pagination Controls */}
              {!loading && orders.length > ordersPerPage && (
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>

                  <span className="pagination-info">
                    Page {currentPage} of{" "}
                    {Math.ceil(orders.length / ordersPerPage)}
                  </span>

                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          Math.ceil(orders.length / ordersPerPage),
                          prev + 1,
                        ),
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(orders.length / ordersPerPage)
                    }
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Wishlist Section */}
          {activeSection === "wishlist" && (
            <div className="profile-section">
              <h2>My Wishlist</h2>
              <p>Your saved products</p>

              <div className="wishlist-items">
                {wishlist.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#666",
                      padding: "40px",
                    }}
                  >
                    Your wishlist is empty
                  </p>
                ) : (
                  wishlist.map((item) => (
                    <div key={item.id} className="wishlist-card">
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundColor: "#eee",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: "5px" }}>{item.name}</h3>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "var(--primary-orange)",
                            marginBottom: "10px",
                          }}
                        >
                          ₹{item.price}
                        </div>
                        <button
                          className="btn"
                          style={{ padding: "8px 15px", fontSize: "0.9rem" }}
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="btn"
                          style={{
                            padding: "8px 15px",
                            fontSize: "0.9rem",
                            backgroundColor: "#6c757d",
                            marginLeft: "10px",
                          }}
                          onClick={() => toggleWishlist(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
