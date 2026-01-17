import { useState, useEffect } from "react";
import { adminService } from "../../services/apiService";
import "./AdminPanel.css";

const AdminPanel = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    ordersCompleted: 0,
    ordersCancelled: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dashboard stats when component mounts
  useEffect(() => {
    fetchDashboardStats();
    if (activeSection === "dashboard") {
      fetchRecentOrders();
    }
  }, [activeSection]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await adminService.getAllOrders({ limit: 10 });
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="admin-overlay active">
      <div className="admin-panel">
        <div className="admin-sidebar">
          <h3>
            <i className="fas fa-shield-alt"></i> Admin Panel
          </h3>

          <div className="admin-nav">
            <ul>
              <li>
                <a
                  href="#"
                  className={activeSection === "dashboard" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection("dashboard");
                  }}
                >
                  <i className="fas fa-chart-pie"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activeSection === "products" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection("products");
                  }}
                >
                  <i className="fas fa-box"></i>
                  <span>Products</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activeSection === "orders" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection("orders");
                  }}
                >
                  <i className="fas fa-shopping-cart"></i>
                  <span>Orders</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-header">
            <h2>
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
            <button className="admin-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="admin-section">
              <h2 className="dashboard-title">Dashboard Overview</h2>

              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                <>
                  <div className="admin-stats">
                    <div className="admin-stat-card total-earnings">
                      <div className="stat-icon">
                        <i className="fas fa-rupee-sign"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Total Earnings</p>
                        <h3 className="stat-value">
                          {formatCurrency(dashboardStats.totalEarnings)}
                        </h3>
                      </div>
                    </div>
                    <div className="admin-stat-card this-month">
                      <div className="stat-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">This Month</p>
                        <h3 className="stat-value">
                          {formatCurrency(dashboardStats.thisMonthEarnings)}
                        </h3>
                      </div>
                    </div>
                    <div className="admin-stat-card total-orders">
                      <div className="stat-icon">
                        <i className="fas fa-shopping-bag"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Total Orders</p>
                        <h3 className="stat-value">
                          {dashboardStats.totalOrders}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="admin-stats secondary">
                    <div className="admin-stat-card pending">
                      <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Pending Orders</p>
                        <h3 className="stat-value">
                          {dashboardStats.pendingOrders}
                        </h3>
                      </div>
                    </div>
                    <div className="admin-stat-card completed">
                      <div className="stat-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Completed</p>
                        <h3 className="stat-value">
                          {dashboardStats.ordersCompleted}
                        </h3>
                      </div>
                    </div>
                    <div className="admin-stat-card cancelled">
                      <div className="stat-icon">
                        <i className="fas fa-times-circle"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Cancelled</p>
                        <h3 className="stat-value">
                          {dashboardStats.ordersCancelled}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="admin-stats secondary">
                    <div className="admin-stat-card products">
                      <div className="stat-icon">
                        <i className="fas fa-boxes"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Total Products</p>
                        <h3 className="stat-value">
                          {dashboardStats.totalProducts}
                        </h3>
                      </div>
                    </div>
                    <div className="admin-stat-card users">
                      <div className="stat-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Total Users</p>
                        <h3 className="stat-value">
                          {dashboardStats.totalUsers}
                        </h3>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Products Section */}
          {activeSection === "products" && (
            <div className="admin-section">
              <div className="coming-soon">
                <i
                  className="fas fa-box"
                  style={{
                    fontSize: "4rem",
                    color: "#ccc",
                    marginBottom: "20px",
                  }}
                ></i>
                <h3>Product Management</h3>
                <p>This feature is coming soon!</p>
              </div>
            </div>
          )}

          {/* Other Sections */}
          {activeSection === "orders" && (
            <div className="admin-section">
              <div className="coming-soon">
                <i
                  className="fas fa-shopping-cart"
                  style={{
                    fontSize: "4rem",
                    color: "#ccc",
                    marginBottom: "20px",
                  }}
                ></i>
                <h3>Order Management</h3>
                <p>This feature is coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
