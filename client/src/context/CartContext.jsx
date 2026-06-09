import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });

  // 1. Initial load from LocalStorage
  useEffect(() => {
    const localCart = localStorage.getItem('cartItems');
    const localWishlist = localStorage.getItem('wishlist');
    const localShipping = localStorage.getItem('shippingAddress');

    if (localCart) setCartItems(JSON.parse(localCart));
    if (localWishlist) setWishlist(JSON.parse(localWishlist));
    if (localShipping) setShippingAddress(JSON.parse(localShipping));
  }, []);

  // 2. Fetch/Sync cart from database when user changes
  useEffect(() => {
    const fetchDBCart = async () => {
      if (user) {
        try {
          const dbCart = await api.cart.get();
          if (dbCart && dbCart.length > 0) {
            // Map Mongoose populate output back to flat cart items format
            const mappedCart = dbCart.map(item => ({
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              discountPrice: item.product.discountPrice,
              image: item.product.images[0],
              stockQuantity: item.product.stockQuantity,
              qty: item.qty,
            }));
            setCartItems(mappedCart);
            localStorage.setItem('cartItems', JSON.stringify(mappedCart));
          } else if (cartItems.length > 0) {
            // Client has guest items but server has none: sync client to server
            await syncCart(cartItems);
          }
        } catch (error) {
          console.error('Failed to sync cart with database', error);
        }
      }
    };

    fetchDBCart();
  }, [user]);

  // Save changes to localStorage and sync to DB
  const updateCartStateAndStorage = async (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    
    if (user) {
      await syncCart(newItems);
    }
  };

  const syncCart = async (items) => {
    try {
      const payload = items.map(item => ({
        product: item._id,
        qty: item.qty,
      }));
      await api.cart.sync(payload);
    } catch (error) {
      console.error('Error syncing cart to database', error);
    }
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    let newItems;

    if (existItem) {
      newItems = cartItems.map((x) =>
        x._id === product._id
          ? { ...x, qty: Math.min(x.qty + qty, product.stockQuantity) }
          : x
      );
    } else {
      newItems = [
        ...cartItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.images ? product.images[0] : product.image,
          stockQuantity: product.stockQuantity,
          qty,
        },
      ];
    }
    updateCartStateAndStorage(newItems);
  };

  const removeFromCart = (id) => {
    const newItems = cartItems.filter((x) => x._id !== id);
    updateCartStateAndStorage(newItems);
  };

  const updateCartQty = (id, qty) => {
    const newItems = cartItems.map((x) =>
      x._id === id ? { ...x, qty: Number(qty) } : x
    );
    updateCartStateAndStorage(newItems);
  };

  const clearCart = () => {
    updateCartStateAndStorage([]);
  };

  // Wishlist operations
  const addToWishlist = (product) => {
    if (!wishlist.find((x) => x._id === product._id)) {
      const newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  const removeFromWishlist = (id) => {
    const newWishlist = wishlist.filter((x) => x._id !== id);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  // Address
  const saveShippingAddress = (addressData) => {
    setShippingAddress(addressData);
    localStorage.setItem('shippingAddress', JSON.stringify(addressData));
  };

  // Summary Metrics
  const itemsPrice = cartItems.reduce((acc, item) => {
    const activePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
    return acc + activePrice * item.qty;
  }, 0);

  // Free shipping above 1000 INR, else 99 INR
  const shippingPrice = itemsPrice === 0 ? 0 : itemsPrice > 1000 ? 0 : 99;
  
  // 18% GST (Apparel)
  const taxPrice = Math.round(itemsPrice * 0.18);
  
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        shippingAddress,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        saveShippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
