import api from "./api";

// Auth Services
export const authService = {
  // Initiate Google OAuth
  loginWithGoogle: () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return response.data;
  },
};

// Product Services
export const productService = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get("/products/featured");
    return response.data;
  },

  // Get single product
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

// Cart Services
export const cartService = {
  // Get user cart
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },

  // Add to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/cart", { productId, quantity });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data;
  },
};

// Order Services
export const orderService = {
  // Create order
  createOrder: async (shippingAddress) => {
    const response = await api.post("/orders", { shippingAddress });
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  // Get single order
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Process payment
  processPayment: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/payment`);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/verify-payment`);
    return response.data;
  },
};

// User Services
export const userService = {
  // Get profile
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },
};

// Admin Services
export const adminService = {
  // Product Management
  createProduct: async (formData) => {
    const response = await api.post("/admin/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProduct: async (id, formData) => {
    const response = await api.put(`/admin/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  toggleFeatured: async (id) => {
    const response = await api.patch(`/admin/products/${id}/featured`);
    return response.data;
  },

  // Order Management
  getAllOrders: async (params = {}) => {
    const response = await api.get("/admin/orders", { params });
    return response.data;
  },

  updateOrderStatus: async (id, orderStatus) => {
    const response = await api.put(`/admin/orders/${id}/status`, {
      orderStatus,
    });
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },
};

// Page Services
export const pageService = {
  // Get page content
  getPageContent: async (pageType) => {
    const response = await api.get(`/pages/${pageType}`);
    return response.data;
  },

  // Submit contact form
  submitContactForm: async (formData) => {
    const response = await api.post("/pages/contact/submit", formData);
    return response.data;
  },

  // Admin: Get all pages
  getAllPages: async () => {
    const response = await api.get("/pages");
    return response.data;
  },

  // Admin: Update page content
  updatePageContent: async (pageType, data) => {
    const response = await api.put(`/pages/${pageType}`, data);
    return response.data;
  },

  // Admin: Get contact submissions
  getContactSubmissions: async () => {
    const response = await api.get("/pages/contact/submissions");
    return response.data;
  },

  // Admin: Update contact submission status
  updateContactSubmission: async (id, status) => {
    const response = await api.put(`/pages/contact/submissions/${id}`, {
      status,
    });
    return response.data;
  },
};
