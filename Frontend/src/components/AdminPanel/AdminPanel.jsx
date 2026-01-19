import { useState, useEffect } from "react";
import { toast } from "react-toastify";
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

  // Order management states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Fetch dashboard stats when component mounts
  useEffect(() => {
    fetchDashboardStats();
    if (activeSection === "dashboard") {
      fetchRecentOrders();
    } else if (activeSection === "orders") {
      fetchAllOrders();
    }
  }, [activeSection]);

  // Fetch orders when filters change
  useEffect(() => {
    if (activeSection === "orders") {
      fetchAllOrders();
    }
  }, [currentPage, statusFilter, searchQuery, startDate, endDate]);

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

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter) {
        params.orderStatus = statusFilter;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (startDate) {
        params.startDate = startDate;
      }

      if (endDate) {
        params.endDate = endDate;
      }

      const response = await adminService.getAllOrders(params);
      if (response.success) {
        setOrders(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalOrders(response.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await adminService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        // Refresh orders
        fetchAllOrders();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAllOrders();
  };

  const handleFilterReset = () => {
    setStatusFilter("");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
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
              <div className="orders-filters">
                <form onSubmit={handleSearchSubmit} className="search-form">
                  <div className="search-input-group">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search by Order Number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-search">
                    Search
                  </button>
                </form>

                <div className="filter-group">
                  <div className="filter-item">
                    <label>Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="filter-item">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <div className="filter-item">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <button className="btn-reset" onClick={handleFilterReset}>
                    <i className="fas fa-redo"></i> Reset
                  </button>
                </div>
              </div>

              <div className="orders-summary">
                <p>
                  Showing {orders.length} of {totalOrders} orders
                </p>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading orders...</p>
                </div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <i className="fas fa-inbox"></i>
                  <p>No orders found</p>
                </div>
              ) : (
                <>
                  <div className="orders-table-container">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Amount</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td className="order-number">
                              {order.orderNumber}
                            </td>
                            <td>
                              <div className="customer-info">
                                <div className="customer-name">
                                  {order.userId?.name || "N/A"}
                                </div>
                                <div className="customer-email">
                                  {order.userId?.email || ""}
                                </div>
                              </div>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td className="items-count">
                              {order.items?.length || 0} items
                            </td>
                            <td className="order-amount">
                              {formatCurrency(order.totalAmount)}
                            </td>
                            <td>
                              <span
                                className={`payment-badge ${order.paymentStatus}`}
                              >
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td>
                              <select
                                className={`status-select ${order.orderStatus}`}
                                value={order.orderStatus}
                                onChange={(e) =>
                                  handleStatusUpdate(order._id, e.target.value)
                                }
                                disabled={updatingOrderId === order._id}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn-view"
                                onClick={() =>
                                  toast.info(
                                    `Order ${order.orderNumber} - Status: ${order.status}`,
                                  )
                                }
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-chevron-left"></i> Previous
                      </button>

                      <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                      </div>

                      <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
