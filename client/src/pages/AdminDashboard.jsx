import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  BarChart2,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  // Stats / Reports
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    dailySales: [],
    categorySales: []
  });

  // Entities lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Loading flags
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals / Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'T-Shirts',
    price: 0,
    discountPrice: 0,
    stockQuantity: 0,
    images: ''
  });

  // Fetch initial analytics, then fetch tab specific lists when active tab changes
  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    setError('');
    setSuccess('');
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.orders.getSalesReport();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load sales analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.categories.getAll();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.users.getAll();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Product CRUD
  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      category: 'T-Shirts',
      price: 0,
      discountPrice: 0,
      stockQuantity: 0,
      images: ''
    });
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice,
      stockQuantity: product.stockQuantity,
      images: product.images.join(', ')
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const imagesArray = productForm.images
        ? productForm.images.split(',').map((img) => img.trim())
        : editingProduct ? editingProduct.images : [];

      const payload = {
        ...productForm,
        price: Number(productForm.price),
        discountPrice: Number(productForm.discountPrice),
        stockQuantity: Number(productForm.stockQuantity),
        images: imagesArray
      };

      if (editingProduct) {
        await api.products.update(editingProduct._id, payload);
        setSuccess('Product updated successfully!');
      } else {
        await api.products.create(payload);
        setSuccess('Product created successfully!');
      }

      setShowProductModal(false);
      fetchProducts();
      fetchAnalytics(); // Refresh analytics stats
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setActionLoading(true);
    try {
      await api.products.delete(id);
      setSuccess('Product removed');
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Order Fulfillment
  const handleOrderStatusUpdate = async (id, status) => {
    setActionLoading(true);
    try {
      await api.orders.updateStatus(id, { status });
      setSuccess('Order status updated');
      fetchOrders();
      fetchAnalytics();
    } catch (err) {
      setError(err.message || 'Failed to update order');
    } finally {
      setActionLoading(false);
    }
  };

  // User Actions
  const handleToggleAdmin = async (userObj) => {
    setActionLoading(true);
    try {
      await api.users.update(userObj._id, { isAdmin: !userObj.isAdmin });
      setSuccess('User privileges updated');
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user account?')) return;
    setActionLoading(true);
    try {
      await api.users.delete(id);
      setSuccess('User account removed');
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">Store Administration</h1>
          <p className="text-sm text-slate-400 mt-1">Manage stock inventories, orders status, sales charts, and customer lists.</p>
        </div>
        
        {activeTab === 'products' && (
          <button
            onClick={openCreateModal}
            className="self-start sm:self-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/10 transition-colors"
          >
            <Plus size={16} />
            Add New Product
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-100 overflow-x-auto gap-6 text-sm font-bold pb-1 text-slate-500">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 flex items-center gap-1.5 border-b-2 px-1 transition-all ${
            activeTab === 'analytics' ? 'border-amber-600 text-amber-600 font-black' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <BarChart2 size={18} />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 flex items-center gap-1.5 border-b-2 px-1 transition-all ${
            activeTab === 'products' ? 'border-amber-600 text-amber-600 font-black' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Package size={18} />
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 flex items-center gap-1.5 border-b-2 px-1 transition-all ${
            activeTab === 'orders' ? 'border-amber-600 text-amber-600 font-black' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <ShoppingBag size={18} />
          Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 flex items-center gap-1.5 border-b-2 px-1 transition-all ${
            activeTab === 'users' ? 'border-amber-600 text-amber-600 font-black' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Users size={18} />
          Users
        </button>
      </div>

      {/* Notices */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-150 text-red-700 rounded-2xl text-sm flex items-center gap-2">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-sm flex items-center gap-2">
          <Check size={18} className="flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab Panels */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-amber-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'analytics' && (
            <div className="space-y-10">
              {/* Analytics stats grids */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Sales</span>
                    <DollarSign size={18} className="text-amber-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">₹{stats.totalSales}</p>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <TrendingUp size={12} />
                    +12% this week
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag size={18} className="text-blue-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalOrders}</p>
                  <span className="text-[10px] text-slate-400">Paid and Pending orders</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Products</span>
                    <Package size={18} className="text-purple-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalProducts}</p>
                  <span className="text-[10px] text-slate-400">Active clothes in catalog</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
                    <Users size={18} className="text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalUsers}</p>
                  <span className="text-[10px] text-slate-400">Registered client accounts</span>
                </div>
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales report chart (CSS based bar chart) */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
                  <h3 className="font-bold text-slate-800 text-base">Daily Sales Overview</h3>
                  {stats.dailySales.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-12">No recent sales records to chart.</p>
                  ) : (
                    <div className="flex items-end justify-between h-48 pt-6 px-4">
                      {stats.dailySales.map((day, idx) => {
                        // Calculate max for heights
                        const maxSales = Math.max(...stats.dailySales.map(d => d.sales), 1);
                        const percentHeight = Math.max(10, Math.round((day.sales / maxSales) * 100));
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                            {/* Hover tooltip */}
                            <span className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded absolute -translate-y-8 transition-opacity">
                              ₹{day.sales}
                            </span>
                            {/* Bar container */}
                            <div
                              style={{ height: `${percentHeight}%` }}
                              className="w-6 sm:w-8 bg-amber-600 rounded-t-md hover:bg-amber-700 transition-colors"
                            ></div>
                            <span className="text-[9px] text-slate-400 font-semibold">{day._id.substring(5)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Category stats split */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
                  <h3 className="font-bold text-slate-800 text-base">Sales by Category</h3>
                  {stats.categorySales.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-12">No category data. Seed database to start.</p>
                  ) : (
                    <div className="space-y-4 pt-4">
                      {stats.categorySales.map((cat, idx) => {
                        const totalCatSales = stats.categorySales.reduce((acc, c) => acc + c.sales, 1);
                        const percent = Math.round((cat.sales / totalCatSales) * 100);
                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>{cat.category}</span>
                              <span>₹{cat.sales} ({percent}%)</span>
                            </div>
                            {/* Bar */}
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${percent}%` }}
                                className={`h-full ${idx === 0 ? 'bg-amber-600' : 'bg-slate-700'}`}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab Products Panel */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase font-bold">
                      <th className="py-4 px-6 font-semibold">Product Details</th>
                      <th className="py-4 px-6 font-semibold">Category</th>
                      <th className="py-4 px-6 font-semibold">Price</th>
                      <th className="py-4 px-6 font-semibold">Stock Qty</th>
                      <th className="py-4 px-6 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="w-10 h-14 object-cover rounded-lg border" />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 truncate max-w-xs">{product.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{product._id}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-normal text-slate-500">{product.category}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-900 font-bold">₹{product.discountPrice > 0 ? product.discountPrice : product.price}</span>
                            {product.discountPrice > 0 && <span className="line-through text-slate-400 font-normal">₹{product.price}</span>}
                          </div>
                        </td>
                        <td className={`py-4 px-6 ${product.stockQuantity <= 5 ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                          {product.stockQuantity} items
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleProductDelete(product._id)}
                              className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Orders Panel */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase font-bold">
                      <th className="py-4 px-6 font-semibold">Order ID</th>
                      <th className="py-4 px-6 font-semibold">Customer</th>
                      <th className="py-4 px-6 font-semibold">Order Total</th>
                      <th className="py-4 px-6 font-semibold">Payment</th>
                      <th className="py-4 px-6 font-semibold text-center">Status Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-mono text-slate-900">{order._id.substring(0, 12)}...</td>
                        <td className="py-4 px-6 font-normal text-slate-550">{order.user ? order.user.name : 'Unknown User'}</td>
                        <td className="py-4 px-6 text-slate-900 font-bold">₹{order.totalPrice}</td>
                        <td className="py-4 px-6 font-normal">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${order.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {order.paymentMethod} {order.isPaid ? '✓ Paid' : '⏳ Pend.'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <select
                            value={order.status}
                            disabled={actionLoading}
                            onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs font-semibold focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Users Panel */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase font-bold">
                      <th className="py-4 px-6 font-semibold">User Details</th>
                      <th className="py-4 px-6 font-semibold">Email</th>
                      <th className="py-4 px-6 font-semibold text-center">Privilege</th>
                      <th className="py-4 px-6 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {users.map((userObj) => (
                      <tr key={userObj._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                            {userObj.name.charAt(0)}
                          </div>
                          <h4 className="font-bold text-slate-800">{userObj.name}</h4>
                        </td>
                        <td className="py-4 px-6 font-normal text-slate-500">{userObj.email}</td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleToggleAdmin(userObj)}
                            disabled={userObj.email === 'nanugujar@nanugujar.com'}
                            className={`px-3 py-1 rounded-full border text-[9px] font-bold ${
                              userObj.isAdmin
                                ? 'bg-amber-50 text-amber-700 border-amber-150'
                                : 'bg-slate-50 text-slate-500 border-slate-150 hover:bg-slate-100'
                            }`}
                          >
                            {userObj.isAdmin ? 'Admin' : 'Customer'}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleUserDelete(userObj._id)}
                            disabled={userObj.email === 'nanugujar@nanugujar.com'}
                            className="p-2 bg-slate-50 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setShowProductModal(false)}></div>
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative z-15 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Clothing Details' : 'Add New Clothing Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-650">×</button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-5 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Description</label>
                  <textarea
                    rows="3"
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Pants">Pants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Discount Price (₹, Optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Image URLs (comma separated)</label>
                  <input
                    type="text"
                    placeholder="https://unsplash.com/..., https://unsplash.com/..."
                    value={productForm.images}
                    onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3 text-center border border-slate-200 bg-white font-bold text-xs rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-md transition-colors"
                >
                  {actionLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
