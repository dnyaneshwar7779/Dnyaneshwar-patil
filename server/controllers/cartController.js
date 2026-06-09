import User from '../models/User.js';

// @desc    Get user cart items
// @route   GET /api/cart
// @access  Private
export const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cartItems.product');
    if (user) {
      res.json(user.cartItems || []);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync user cart items (batch update)
// @route   POST /api/cart
// @access  Private
export const syncUserCart = async (req, res) => {
  const { cartItems } = req.body; // Array of { product: productId, qty: quantity }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.cartItems = cartItems.map(item => ({
        product: item.product,
        qty: item.qty,
      }));

      await user.save();
      const updatedUser = await User.findById(req.user._id).populate('cartItems.product');
      res.json(updatedUser.cartItems || []);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
