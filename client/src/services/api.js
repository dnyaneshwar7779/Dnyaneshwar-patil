const BASE_URL = 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  // Auth & Profile
  auth: {
    login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: credentials }),
    register: (userData) => apiFetch('/auth/register', { method: 'POST', body: userData }),
    getProfile: () => apiFetch('/auth/profile'),
    updateProfile: (userData) => apiFetch('/auth/profile', { method: 'PUT', body: userData }),
    forgotPassword: (email) => apiFetch('/auth/forgot-password', { method: 'POST', body: { email } }),
  },
  
  // Products
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.keyword) query.append('keyword', params.keyword);
      if (params.category) query.append('category', params.category);
      if (params.minPrice) query.append('minPrice', params.minPrice);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.sort) query.append('sort', params.sort);
      
      const queryString = query.toString();
      return apiFetch(`/products${queryString ? `?${queryString}` : ''}`);
    },
    getOne: (id) => apiFetch(`/products/${id}`),
    create: (productData) => apiFetch('/products', { method: 'POST', body: productData }),
    update: (id, productData) => apiFetch(`/products/${id}`, { method: 'PUT', body: productData }),
    delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
    
    // Reviews
    getReviews: (id) => apiFetch(`/products/${id}/reviews`),
    createReview: (id, reviewData) => apiFetch(`/products/${id}/reviews`, { method: 'POST', body: reviewData }),
  },

  // Categories
  categories: {
    getAll: () => apiFetch('/categories'),
    create: (catData) => apiFetch('/categories', { method: 'POST', body: catData }),
    update: (id, catData) => apiFetch(`/categories/${id}`, { method: 'PUT', body: catData }),
    delete: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),
  },

  // Cart (Database syncing)
  cart: {
    get: () => apiFetch('/cart'),
    sync: (cartItems) => apiFetch('/cart', { method: 'POST', body: { cartItems } }),
  },

  // Orders
  orders: {
    create: (orderData) => apiFetch('/orders', { method: 'POST', body: orderData }),
    getOne: (id) => apiFetch(`/orders/${id}`),
    getMyOrders: () => apiFetch('/orders/myorders'),
    
    // Admin
    getAll: () => apiFetch('/orders'),
    updateStatus: (id, statusData) => apiFetch(`/orders/${id}/status`, { method: 'PUT', body: statusData }),
    getSalesReport: () => apiFetch('/orders/sales-report'),
  },

  // Users (Admin management)
  users: {
    getAll: () => apiFetch('/auth/users'),
    update: (id, userData) => apiFetch(`/auth/users/${id}`, { method: 'PUT', body: userData }),
    delete: (id) => apiFetch(`/auth/users/${id}`, { method: 'DELETE' }),
  }
};
