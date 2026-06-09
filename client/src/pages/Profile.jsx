import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Mail, ShieldAlert, Award, Package, ShoppingBag, Eye, X, CheckCircle, Clock } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const data = await api.orders.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (password && password !== confirmPassword) {
      setErr('Passwords do not match');
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({
        name,
        email,
        ...(password && { password }),
      });
      setMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErr(error.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'Processing':
        return 'bg-purple-50 text-purple-700 border-purple-150';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-150';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-150';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-10">User Account Center</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Profile Settings Card */}
        <div className="lg:col-span-1 bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl uppercase font-display">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1 mt-0.5">
                <Award size={12} className="text-amber-500" />
                {user?.isAdmin ? 'Store Administrator' : 'Premium Customer'}
              </span>
            </div>
          </div>

          <hr className="border-slate-100" />

          <h3 className="font-bold text-sm text-slate-800">Update Profile</h3>

          {msg && <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs">{msg}</div>}
          {err && <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs">{err}</div>}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                />
                <User size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                />
                <Mail size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">New Password (Optional)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs shadow-md transition-colors disabled:opacity-50"
            >
              {profileLoading ? 'Saving changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package size={22} className="text-slate-400" />
            Order History
          </h2>

          {loadingOrders ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-2xl w-full"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-14 bg-slate-50 rounded-2xl space-y-4">
              <div className="mx-auto w-12 h-12 bg-white text-slate-300 rounded-full flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">No Orders Found</p>
                <p className="text-xs text-slate-400 mt-0.5">You haven't placed any orders yet.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold">
                    <th className="py-4 font-semibold">Order ID</th>
                    <th className="py-4 font-semibold">Date</th>
                    <th className="py-4 font-semibold">Total Price</th>
                    <th className="py-4 font-semibold text-center">Status</th>
                    <th className="py-4 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-mono text-slate-900">{order._id.substring(0, 10)}...</td>
                      <td className="py-4 font-normal text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 font-bold text-slate-900">₹{order.totalPrice}</td>
                      <td className="py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full border text-[10px] ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 flex items-center justify-center inline-flex transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Selected Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Order details</h3>
                <p className="text-xs text-slate-450 font-mono mt-0.5">ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Status indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Payment status</span>
                {selectedOrder.isPaid ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle size={14} />
                    Paid on {new Date(selectedOrder.paidAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold">
                    <Clock size={14} />
                    Unpaid (COD Pend.)
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Delivery Status</span>
                {selectedOrder.isDelivered ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle size={14} />
                    Delivered on {new Date(selectedOrder.deliveredAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold">
                    <Clock size={14} />
                    {selectedOrder.status}
                  </div>
                )}
              </div>
            </div>

            {/* Clothes List */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-800">Purchased Items</h4>
              <div className="divide-y divide-slate-100">
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-14 object-cover rounded-lg border flex-shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{item.name}</h5>
                        <p className="text-[10px] text-slate-400">₹{item.price} × {item.qty}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address details */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-slate-800">Shipping Information</h4>
              <p className="text-slate-600">Address: <strong>{selectedOrder.shippingAddress.address}</strong></p>
              <p className="text-slate-600">City: <strong>{selectedOrder.shippingAddress.city}</strong></p>
              <p className="text-slate-600">PIN Code: <strong>{selectedOrder.shippingAddress.postalCode}</strong></p>
              <p className="text-slate-600">Contact Number: <strong>{selectedOrder.shippingAddress.phone}</strong></p>
            </div>

            {/* Total invoice details */}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Method: {selectedOrder.paymentMethod}</span>
              <span className="text-sm font-bold text-slate-900">
                Grand Total: <strong className="text-base text-amber-600 font-black">₹{selectedOrder.totalPrice}</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
