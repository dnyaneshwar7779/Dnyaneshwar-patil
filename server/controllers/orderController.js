import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // 1. Verify and update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404).json({ message: `Product ${item.name} not found` });
        return;
      }
      if (product.stockQuantity < item.qty) {
        res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}` });
        return;
      }
      product.stockQuantity -= item.qty;
      await product.save();
    }

    // 2. Create the order
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'COD' ? false : true, // Auto-paid for UPI/Razorpay in mock
      paidAt: paymentMethod === 'COD' ? null : new Date(),
    });

    const createdOrder = await order.save();

    // 3. Clear user's backend cart on order success
    const user = await User.findById(req.user._id);
    if (user) {
      user.cartItems = [];
      await user.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user is admin or the order owner
      if (req.user.isAdmin || order.user._id.toString() === req.user._id.toString()) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status / deliver details (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status, isPaid, isDelivered } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status || order.status;
      
      if (isPaid !== undefined) {
        order.isPaid = isPaid;
        if (isPaid) order.paidAt = new Date();
      }

      if (isDelivered !== undefined) {
        order.isDelivered = isDelivered;
        if (isDelivered) {
          order.deliveredAt = new Date();
          order.status = 'Delivered';
          // Delivering automatically implies paid if COD
          if (order.paymentMethod === 'COD') {
            order.isPaid = true;
            order.paidAt = new Date();
          }
        }
      }

      // Sync status triggers
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        if (order.paymentMethod === 'COD') {
          order.isPaid = true;
          order.paidAt = new Date();
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Sales reports & Analytics (Admin Dashboard)
// @route   GET /api/orders/sales-report
// @access  Private/Admin
export const getSalesReport = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Calculate total sales
    const salesData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Sales group by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySales = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Group by category sales for visual insights
    const orders = await Order.find({ isPaid: true });
    const categoryStats = {};

    for (const order of orders) {
      for (const item of order.orderItems) {
        const prod = await Product.findById(item.product);
        const category = prod ? prod.category : 'Unknown';
        categoryStats[category] = (categoryStats[category] || 0) + (item.price * item.qty);
      }
    }

    const categorySales = Object.keys(categoryStats).map(key => ({
      category: key,
      sales: categoryStats[key],
    }));

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalSales,
      dailySales,
      categorySales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
