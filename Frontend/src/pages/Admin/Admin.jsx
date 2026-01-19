import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  adminService,
  productService,
  pageService,
  categoryService,
  promoCodeService,
  shippingConfigService,
} from "../../services/apiService";
import { useUser } from "../../context/UserContext";
import "./Admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pages, setPages] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [shippingConfig, setShippingConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  // Order management states
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderTotalCount, setOrderTotalCount] = useState(0);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStartDate, setOrderStartDate] = useState("");
  const [orderEndDate, setOrderEndDate] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPageForm, setShowPageForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPromoCodeForm, setShowPromoCodeForm] = useState(false);
  const [showShippingConfigForm, setShowShippingConfigForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingPromoCode, setEditingPromoCode] = useState(null);
  const { isAdmin, isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
      return;
    }
    loadDashboardStats();
  }, [isLoggedIn, isAdmin, navigate]);

  useEffect(() => {
    if (activeTab === "products") {
      loadProducts();
    } else if (activeTab === "orders") {
      loadOrders();
    } else if (activeTab === "pages") {
      loadPages();
    } else if (activeTab === "contacts") {
      loadContactSubmissions();
    } else if (activeTab === "categories") {
      loadCategories();
    } else if (activeTab === "promoCodes") {
      loadPromoCodes();
    } else if (activeTab === "shipping") {
      loadShippingConfig();
    }
  }, [activeTab]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({ limit: 50 });
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: orderCurrentPage,
        limit: 10,
      };

      if (orderStatusFilter) {
        params.orderStatus = orderStatusFilter;
      }

      if (orderSearchQuery.trim()) {
        params.search = orderSearchQuery.trim();
      }

      if (orderStartDate) {
        params.startDate = orderStartDate;
      }

      if (orderEndDate) {
        params.endDate = orderEndDate;
      }

      const response = await adminService.getAllOrders(params);
      if (response.success) {
        setOrders(response.data);
        setOrderTotalPages(response.pagination?.totalPages || 1);
        setOrderTotalCount(response.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload orders when filters change
  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    }
  }, [orderCurrentPage, orderStatusFilter, orderStartDate, orderEndDate]);

  const handleOrderSearch = (e) => {
    e.preventDefault();
    setOrderCurrentPage(1);
    loadOrders();
  };

  const handleOrderFilterReset = () => {
    setOrderStatusFilter("");
    setOrderSearchQuery("");
    setOrderStartDate("");
    setOrderEndDate("");
    setOrderCurrentPage(1);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await adminService.deleteProduct(id);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await adminService.toggleFeatured(id);
      loadProducts();
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };
  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await pageService.getAllPages();
      if (response.success) {
        setPages(response.data);
      }
    } catch (error) {
      console.error("Error loading pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadContactSubmissions = async () => {
    try {
      setLoading(true);
      const response = await pageService.getContactSubmissions();
      if (response.success) {
        setContactSubmissions(response.data);
      }
    } catch (error) {
      console.error("Error loading contact submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories(true);
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await categoryService.deleteCategory(id);
      if (response.success) {
        toast.success("Category deleted successfully!");
        loadCategories();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete category";
      toast.error(errorMsg);
      console.error("Error deleting category:", error);
    }
  };

  const handleToggleCategoryStatus = async (id) => {
    try {
      const response = await categoryService.toggleCategoryStatus(id);
      if (response.success) {
        loadCategories();
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
    }
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setShowPageForm(true);
  };

  const handleUpdateContactStatus = async (id, status) => {
    try {
      await pageService.updateContactSubmission(id, status);
      loadContactSubmissions();
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await promoCodeService.getAllPromoCodes();
      if (response.success) {
        setPromoCodes(response.data);
      }
    } catch (error) {
      console.error("Error loading promo codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPromoCode = (promoCode) => {
    setEditingPromoCode(promoCode);
    setShowPromoCodeForm(true);
  };

  const handleDeletePromoCode = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) {
      return;
    }

    try {
      const response = await promoCodeService.deletePromoCode(id);
      if (response.success) {
        toast.success("Promo code deleted successfully!");
        loadPromoCodes();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete promo code";
      toast.error(errorMsg);
      console.error("Error deleting promo code:", error);
    }
  };

  const handleTogglePromoCodeStatus = async (id) => {
    try {
      const response = await promoCodeService.togglePromoCodeStatus(id);
      if (response.success) {
        loadPromoCodes();
      }
    } catch (error) {
      console.error("Error toggling promo code status:", error);
    }
  };

  const loadShippingConfig = async () => {
    try {
      setLoading(true);
      const response = await shippingConfigService.getShippingConfig();
      if (response.success) {
        setShippingConfig(response.data);
      }
    } catch (error) {
      console.error("Error loading shipping config:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <h2>Dashboard Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <p className="stat-value">
              ₹{stats.totalEarnings?.toLocaleString()}
            </p>
          </div>
          <div className="stat-card">
            <h3>This Month</h3>
            <p className="stat-value">
              ₹{stats.thisMonthEarnings?.toLocaleString()}
            </p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.ordersCompleted}</p>
          </div>
          <div className="stat-card">
            <h3>Cancelled</h3>
            <p className="stat-value">{stats.ordersCancelled}</p>
          </div>
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="products-content">
      <div className="content-header">
        <h2>Product Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowProductForm(true)}
        >
          Add New Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || product.category}</td>
                  <td>₹{product.pricing.offerPrice}</td>
                  <td>
                    <span
                      className={`status-badge ${product.stock === "available" ? "completed" : "cancelled"}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`toggle-btn ${
                        product.isFeatured ? "active" : ""
                      }`}
                      onClick={() => handleToggleFeatured(product._id)}
                    >
                      {product.isFeatured ? "Yes" : "No"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowProductForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="orders-content">
      <h2>Order Management</h2>

      {/* Search and Filters */}
      <div className="orders-filters-section">
        <form onSubmit={handleOrderSearch} className="order-search-form">
          <div className="search-input-wrapper">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by Order Number..."
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>

        <div className="order-filters">
          <div className="filter-field">
            <label>Status</label>
            <select
              value={orderStatusFilter}
              onChange={(e) => {
                setOrderStatusFilter(e.target.value);
                setOrderCurrentPage(1);
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

          <div className="filter-field">
            <label>Start Date</label>
            <input
              type="date"
              value={orderStartDate}
              onChange={(e) => {
                setOrderStartDate(e.target.value);
                setOrderCurrentPage(1);
              }}
            />
          </div>

          <div className="filter-field">
            <label>End Date</label>
            <input
              type="date"
              value={orderEndDate}
              onChange={(e) => {
                setOrderEndDate(e.target.value);
                setOrderCurrentPage(1);
              }}
            />
          </div>

          <button className="btn-reset" onClick={handleOrderFilterReset}>
            <i className="fas fa-redo"></i> Reset
          </button>
        </div>
      </div>

      <div className="orders-summary-info">
        <p>
          Showing {orders.length} of {orderTotalCount} orders
        </p>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="no-orders-message">
          <i className="fas fa-inbox"></i>
          <p>No orders found</p>
        </div>
      ) : (
        <>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.userId?.name || "N/A"}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`status-badge ${order.paymentStatus}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order._id, e.target.value)
                        }
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() =>
                          (window.location.href = `/order-confirmation/${order.orderNumber}`)
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orderTotalPages > 1 && (
            <div className="orders-pagination">
              <button
                className="pagination-btn"
                onClick={() => setOrderCurrentPage((prev) => prev - 1)}
                disabled={orderCurrentPage === 1}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>

              <span className="pagination-info">
                Page {orderCurrentPage} of {orderTotalPages}
              </span>

              <button
                className="pagination-btn"
                onClick={() => setOrderCurrentPage((prev) => prev + 1)}
                disabled={orderCurrentPage === orderTotalPages}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderPages = () => (
    <div className="pages-content">
      <h2>Page Content Management</h2>
      {loading ? (
        <p>Loading pages...</p>
      ) : (
        <div className="pages-grid">
          {["contact", "faq", "shipping", "returns", "privacy"].map(
            (pageType) => {
              const page = pages.find((p) => p.pageType === pageType);
              return (
                <div key={pageType} className="page-card">
                  <h3>
                    {pageType === "contact" && "Contact Us"}
                    {pageType === "faq" && "FAQs"}
                    {pageType === "shipping" && "Shipping Policy"}
                    {pageType === "returns" && "Return & Exchange"}
                    {pageType === "privacy" && "Privacy Policy"}
                  </h3>
                  <p>
                    {page
                      ? `Last updated: ${new Date(
                          page.updatedAt,
                        ).toLocaleDateString()}`
                      : "Not configured"}
                  </p>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      handleEditPage(
                        page || { pageType, title: "", content: "" },
                      )
                    }
                  >
                    <i className="fas fa-edit"></i> Edit Content
                  </button>
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="contacts-content">
      <h2>Contact Form Submissions</h2>
      {loading ? (
        <p>Loading submissions...</p>
      ) : contactSubmissions.length === 0 ? (
        <p>No contact submissions yet.</p>
      ) : (
        <div className="contacts-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contactSubmissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.name}</td>
                  <td>{submission.email}</td>
                  <td>{submission.phone || "N/A"}</td>
                  <td>{submission.subject}</td>
                  <td className="message-cell">
                    {submission.message.substring(0, 50)}...
                  </td>
                  <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${submission.status}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={submission.status}
                      onChange={(e) =>
                        handleUpdateContactStatus(
                          submission._id,
                          e.target.value,
                        )
                      }
                      className="status-select"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="categories-content">
      <div className="content-header">
        <h2>Categories Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryForm(true);
          }}
        >
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="categories-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Order</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>
                    <strong>{category.name}</strong>
                  </td>
                  <td>
                    <code>{category.slug}</code>
                  </td>
                  <td>{category.description || "N/A"}</td>
                  <td>
                    <button
                      className={`toggle-btn ${category.isActive ? "active" : ""}`}
                      onClick={() => handleToggleCategoryStatus(category._id)}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>{category.order}</td>
                  <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderPromoCodes = () => (
    <div className="promo-codes-content">
      <div className="content-header">
        <h2>Promo Codes Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingPromoCode(null);
            setShowPromoCodeForm(true);
          }}
        >
          <i className="fas fa-plus"></i> Add Promo Code
        </button>
      </div>
      {loading ? (
        <p>Loading promo codes...</p>
      ) : (
        <div className="promo-codes-table">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Usage</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr key={promo._id}>
                  <td>
                    <strong>{promo.code}</strong>
                  </td>
                  <td>{promo.description}</td>
                  <td>{promo.discountType === "percentage" ? "%" : "Fixed"}</td>
                  <td>
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : `₹${promo.discountValue}`}
                  </td>
                  <td>₹{promo.minOrderAmount}</td>
                  <td>
                    {promo.usedCount}
                    {promo.usageLimit ? ` / ${promo.usageLimit}` : " / ∞"}
                  </td>
                  <td>{new Date(promo.validUntil).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={`toggle-btn ${promo.isActive ? "active" : ""}`}
                      onClick={() => handleTogglePromoCodeStatus(promo._id)}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditPromoCode(promo)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeletePromoCode(promo._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderShippingConfig = () => (
    <div className="shipping-config-content">
      <div className="content-header">
        <h2>Shipping Configuration</h2>
        <button
          className="btn-primary"
          onClick={() => setShowShippingConfigForm(true)}
        >
          <i className="fas fa-edit"></i> Edit Configuration
        </button>
      </div>
      {loading ? (
        <p>Loading shipping config...</p>
      ) : shippingConfig ? (
        <div className="config-display">
          <div className="config-card">
            <h3>Base Shipping Fee</h3>
            <p className="config-value">₹{shippingConfig.baseShippingFee}</p>
            <small>
              Applied to all orders below the free shipping threshold
            </small>
          </div>
          <div className="config-card">
            <h3>Free Shipping Threshold</h3>
            <p className="config-value">
              ₹{shippingConfig.freeShippingThreshold}
            </p>
            <small>Orders above this amount get free shipping</small>
          </div>
        </div>
      ) : (
        <p>No shipping configuration found</p>
      )}
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </button>
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            <i className="fas fa-box"></i> Products
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <i className="fas fa-shopping-cart"></i> Orders
          </button>
          <button
            className={activeTab === "pages" ? "active" : ""}
            onClick={() => setActiveTab("pages")}
          >
            <i className="fas fa-file-alt"></i> Pages
          </button>
          <button
            className={activeTab === "contacts" ? "active" : ""}
            onClick={() => setActiveTab("contacts")}
          >
            <i className="fas fa-envelope"></i> Contact Forms
          </button>
          <button
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            <i className="fas fa-tags"></i> Categories
          </button>
          <button
            className={activeTab === "promoCodes" ? "active" : ""}
            onClick={() => setActiveTab("promoCodes")}
          >
            <i className="fas fa-ticket-alt"></i> Promo Codes
          </button>
          <button
            className={activeTab === "shipping" ? "active" : ""}
            onClick={() => setActiveTab("shipping")}
          >
            <i className="fas fa-shipping-fast"></i> Shipping
          </button>
        </nav>
      </div>

      <div className="admin-main">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "pages" && renderPages()}
        {activeTab === "contacts" && renderContacts()}
        {activeTab === "categories" && renderCategories()}
        {activeTab === "promoCodes" && renderPromoCodes()}
        {activeTab === "shipping" && renderShippingConfig()}
      </div>

      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setShowProductForm(false);
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}

      {showPageForm && (
        <PageFormModal
          page={editingPage}
          onClose={() => {
            setShowPageForm(false);
            setEditingPage(null);
          }}
          onSave={() => {
            setShowPageForm(false);
            setEditingPage(null);
            loadPages();
          }}
        />
      )}

      {showCategoryForm && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          onSave={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
            loadCategories();
          }}
        />
      )}

      {showPromoCodeForm && (
        <PromoCodeFormModal
          promoCode={editingPromoCode}
          onClose={() => {
            setShowPromoCodeForm(false);
            setEditingPromoCode(null);
          }}
          onSave={() => {
            setShowPromoCodeForm(false);
            setEditingPromoCode(null);
            loadPromoCodes();
          }}
        />
      )}

      {showShippingConfigForm && (
        <ShippingConfigFormModal
          config={shippingConfig}
          onClose={() => setShowShippingConfigForm(false)}
          onSave={() => {
            setShowShippingConfigForm(false);
            loadShippingConfig();
          }}
        />
      )}
    </div>
  );
};

// Product Form Modal Component
const ProductFormModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category?._id || product?.category || "",
    originalPrice: product?.pricing?.originalPrice || "",
    offerPrice: product?.pricing?.offerPrice || "",
    quantity: product?.stock?.quantity || "",
    rating: product?.rating || 0,
    isFeatured: product?.isFeatured || false,
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.success) {
          setCategories(response.data);
          // Set default category if creating new product and categories are loaded
          if (!product && response.data.length > 0 && !formData.category) {
            setFormData((prev) => ({
              ...prev,
              category: response.data[0]._id,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleRemoveExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("pricing[originalPrice]", formData.originalPrice);
      formDataToSend.append("pricing[offerPrice]", formData.offerPrice);
      formDataToSend.append("stock", "available");
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("isFeatured", formData.isFeatured);

      // If editing, send existing images
      if (product) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // Add images
      for (let i = 0; i < images.length; i++) {
        formDataToSend.append("images", images[i]);
      }

      if (product) {
        await adminService.updateProduct(product._id, formDataToSend);
        toast.success("Product updated successfully");
      } else {
        await adminService.createProduct(formDataToSend);
        toast.success("Product created successfully");
      }

      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? "Edit Product" : "Add New Product"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Original Price</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Offer Price</label>
              <input
                type="number"
                value={formData.offerPrice}
                onChange={(e) =>
                  setFormData({ ...formData, offerPrice: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Images (Max 9)</label>

            {product && existingImages.length > 0 && (
              <div className="existing-images-preview">
                <p className="preview-label">Current Images:</p>
                <div className="images-grid">
                  {existingImages.map((img, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={img} alt={`Product ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveExistingImage(index)}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImages(
                  Array.from(e.target.files).slice(
                    0,
                    9 - existingImages.length,
                  ),
                )
              }
            />
            <small>
              {product
                ? `${existingImages.length} existing + ${images.length} new image(s) (Total: ${existingImages.length + images.length}/9)`
                : `${images.length} image(s) selected`}
            </small>
          </div>

          <div className="form-group featured-checkbox-group">
            <label className="featured-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="featured-checkbox"
              />
              <span className="checkbox-text">Featured Product</span>
            </label>
            <small className="featured-hint">
              Only 4 products can be featured at a time
            </small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Page Form Modal Component
const PageFormModal = ({ page, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: page?.title || "",
    content: page?.content || "",
    faqs: page?.faqs || [],
    contactInfo: page?.contactInfo || {
      email: "",
      phone: "",
      address: "",
      workingHours: "",
    },
  });

  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        title: formData.title,
        content: formData.content,
      };

      if (page.pageType === "faq") {
        updateData.faqs = formData.faqs;
      }

      if (page.pageType === "contact") {
        updateData.contactInfo = formData.contactInfo;
      }

      await pageService.updatePageContent(page.pageType, updateData);
      toast.success("Page content updated successfully!");
      onSave();
    } catch (error) {
      console.error("Error updating page:", error);
      toast.error("Failed to update page content");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFormData({
        ...formData,
        faqs: [...formData.faqs, newFaq],
      });
      setNewFaq({ question: "", answer: "" });
    }
  };

  const handleRemoveFaq = (index) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <h2>
          Edit {page.pageType === "contact" && "Contact Us"}
          {page.pageType === "faq" && "FAQs"}
          {page.pageType === "shipping" && "Shipping Policy"}
          {page.pageType === "returns" && "Return & Exchange"}
          {page.pageType === "privacy" && "Privacy Policy"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Page Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {page.pageType === "contact" && (
            <div className="contact-info-fields">
              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={formData.contactInfo.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.contactInfo.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo,
                        address: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Working Hours</label>
                <input
                  type="text"
                  value={formData.contactInfo.workingHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo,
                        workingHours: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}

          {page.pageType === "faq" && (
            <div className="faq-fields">
              <h3>FAQs</h3>
              <div className="faqs-list">
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="faq-item-edit">
                    <strong>Q: {faq.question}</strong>
                    <p>A: {faq.answer}</p>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveFaq(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-faq">
                <div className="form-group">
                  <label>Question</label>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, question: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Answer</label>
                  <textarea
                    rows="3"
                    value={newFaq.answer}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, answer: e.target.value })
                    }
                  ></textarea>
                </div>
                <button
                  type="button"
                  className="btn-add"
                  onClick={handleAddFaq}
                >
                  Add FAQ
                </button>
              </div>
            </div>
          )}

          {(page.pageType === "shipping" ||
            page.pageType === "returns" ||
            page.pageType === "privacy") && (
            <div className="form-group">
              <label>Content</label>
              <small
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#666",
                }}
              >
                Write your content below. Basic HTML tags like &lt;h3&gt;,
                &lt;p&gt;, &lt;ul&gt;, &lt;li&gt; are supported.
              </small>
              <textarea
                rows="15"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
              ></textarea>
            </div>
          )}

          {page.pageType === "contact" && formData.content && (
            <div className="form-group">
              <label>Additional Description (Optional)</label>
              <textarea
                rows="3"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              ></textarea>
            </div>
          )}

          {page.pageType === "faq" && formData.content && (
            <div className="form-group">
              <label>Page Description (Optional)</label>
              <textarea
                rows="3"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              ></textarea>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Category Form Modal Component
const CategoryFormModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    isActive: category?.isActive !== undefined ? category.isActive : true,
    order: category?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = category
        ? await categoryService.updateCategory(category._id, formData)
        : await categoryService.createCategory(formData);

      if (response.success) {
        toast.success(
          category
            ? "Category updated successfully!"
            : "Category created successfully!",
        );
        onSave();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        (category ? "Failed to update category" : "Failed to create category");
      toast.error(errorMsg);
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? "Edit Category" : "Add New Category"}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="e.g., LED Lights"
            />
            <small>This will be displayed on the products page</small>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the category"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                min="0"
              />
              <small>Display order (lower numbers appear first)</small>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.isActive}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? "Saving..."
                : category
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Promo Code Form Modal Component
const PromoCodeFormModal = ({ promoCode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: promoCode?.code || "",
    description: promoCode?.description || "",
    discountType: promoCode?.discountType || "percentage",
    discountValue: promoCode?.discountValue || "",
    minOrderAmount: promoCode?.minOrderAmount || 0,
    maxDiscountAmount: promoCode?.maxDiscountAmount || "",
    usageLimit: promoCode?.usageLimit || "",
    validFrom: promoCode?.validFrom
      ? new Date(promoCode.validFrom).toISOString().slice(0, 16)
      : "",
    validUntil: promoCode?.validUntil
      ? new Date(promoCode.validUntil).toISOString().slice(0, 16)
      : "",
    isActive: promoCode?.isActive !== undefined ? promoCode.isActive : true,
    showOnHomePage: promoCode?.showOnHomePage || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        maxDiscountAmount: formData.maxDiscountAmount || null,
        usageLimit: formData.usageLimit || null,
      };

      const response = promoCode
        ? await promoCodeService.updatePromoCode(promoCode._id, dataToSend)
        : await promoCodeService.createPromoCode(dataToSend);

      if (response.success) {
        toast.success(
          promoCode
            ? "Promo code updated successfully!"
            : "Promo code created successfully!",
        );
        onSave();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        (promoCode
          ? "Failed to update promo code"
          : "Failed to create promo code");
      toast.error(errorMsg);
      console.error("Error saving promo code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{promoCode ? "Edit Promo Code" : "Add New Promo Code"}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Promo Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              required
              placeholder="e.g., SAVE20"
              style={{ textTransform: "uppercase" }}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="Brief description of the promo code"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Discount Type *</label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({ ...formData, discountType: e.target.value })
                }
                required
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Discount Value * (
                {formData.discountType === "percentage" ? "%" : "₹"})
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({ ...formData, discountValue: e.target.value })
                }
                required
                min="0"
                step={formData.discountType === "percentage" ? "1" : "10"}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Min Order Amount (₹)</label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderAmount: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Max Discount Amount (₹) - Optional</label>
              <input
                type="number"
                value={formData.maxDiscountAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDiscountAmount: e.target.value,
                  })
                }
                min="0"
                placeholder="No limit"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Usage Limit - Optional</label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: e.target.value })
              }
              min="1"
              placeholder="Unlimited"
            />
            <small>Leave empty for unlimited usage</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valid From *</label>
              <input
                type="datetime-local"
                value={formData.validFrom}
                onChange={(e) =>
                  setFormData({ ...formData, validFrom: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Valid Until *</label>
              <input
                type="datetime-local"
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.isActive}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "true",
                })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.showOnHomePage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    showOnHomePage: e.target.checked,
                  })
                }
              />
              <span>Show on Home Page (Special Offer)</span>
            </label>
            <small>
              Only one promo code can be shown on the home page at a time
            </small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? "Saving..."
                : promoCode
                  ? "Update Promo Code"
                  : "Create Promo Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Shipping Config Form Modal Component
const ShippingConfigFormModal = ({ config, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    baseShippingFee: config?.baseShippingFee || 50,
    freeShippingThreshold: config?.freeShippingThreshold || 1000,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response =
        await shippingConfigService.updateShippingConfig(formData);

      if (response.success) {
        toast.success("Shipping configuration updated successfully!");
        onSave();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to update shipping configuration";
      toast.error(errorMsg);
      console.error("Error updating shipping config:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Shipping Configuration</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Base Shipping Fee (₹) *</label>
            <input
              type="number"
              value={formData.baseShippingFee}
              onChange={(e) =>
                setFormData({ ...formData, baseShippingFee: e.target.value })
              }
              required
              min="0"
            />
            <small>Standard shipping fee applied to all orders</small>
          </div>

          <div className="form-group">
            <label>Free Shipping Threshold (₹) *</label>
            <input
              type="number"
              value={formData.freeShippingThreshold}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  freeShippingThreshold: e.target.value,
                })
              }
              required
              min="0"
            />
            <small>Orders above this amount qualify for free shipping</small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Saving..." : "Update Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
