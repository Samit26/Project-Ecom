import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminService,
  productService,
  pageService,
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
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPageForm, setShowPageForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
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
      const response = await adminService.getAllOrders({ limit: 50 });
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await adminService.deleteProduct(id);
      alert("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
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
      alert("Order status updated");
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
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
                  <td>{product.category}</td>
                  <td>₹{product.pricing.offerPrice}</td>
                  <td>{product.stock.quantity}</td>
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
      {loading ? (
        <p>Loading orders...</p>
      ) : (
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
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-view">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                          page.updatedAt
                        ).toLocaleDateString()}`
                      : "Not configured"}
                  </p>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      handleEditPage(
                        page || { pageType, title: "", content: "" }
                      )
                    }
                  >
                    <i className="fas fa-edit"></i> Edit Content
                  </button>
                </div>
              );
            }
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
                          e.target.value
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
        </nav>
      </div>

      <div className="admin-main">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "pages" && renderPages()}
        {activeTab === "contacts" && renderContacts()}
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
    </div>
  );
};

// Product Form Modal Component
const ProductFormModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "LED Lights",
    originalPrice: product?.pricing?.originalPrice || "",
    offerPrice: product?.pricing?.offerPrice || "",
    quantity: product?.stock?.quantity || "",
    rating: product?.rating || 0,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
      formDataToSend.append("stock[quantity]", formData.quantity);
      formDataToSend.append("stock[isAvailable]", true);
      formDataToSend.append("rating", formData.rating);

      // Add images
      for (let i = 0; i < images.length; i++) {
        formDataToSend.append("images", images[i]);
      }

      if (product) {
        await adminService.updateProduct(product._id, formDataToSend);
        alert("Product updated successfully");
      } else {
        await adminService.createProduct(formDataToSend);
        alert("Product created successfully");
      }

      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Failed to save product");
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
                <option value="LED Lights">LED Lights</option>
                <option value="Smart Lighting">Smart Lighting</option>
                <option value="Decorative">Decorative</option>
                <option value="Outdoor">Outdoor</option>
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

            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Images (Max 9)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImages(Array.from(e.target.files).slice(0, 9))
              }
            />
            <small>{images.length} image(s) selected</small>
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
      alert("Page content updated successfully!");
      onSave();
    } catch (error) {
      console.error("Error updating page:", error);
      alert("Failed to update page content");
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

          <div className="form-group">
            <label>Content (HTML supported)</label>
            <textarea
              rows="10"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            ></textarea>
          </div>

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

export default Admin;
