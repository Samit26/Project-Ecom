import { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "../services/apiService";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useUser();

  // Load cart when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [isLoggedIn]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        // Transform backend cart format to frontend format
        const transformedCart =
          response.data.items?.map((item) => ({
            id: item._id,
            productId: item.productId._id,
            name: item.productId.name,
            price: item.price,
            quantity: item.quantity,
            image: item.productId.images?.[0] || "",
            stock: item.productId.stock,
          })) || [];
        setCart(transformedCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const response = await cartService.addToCart(
        product._id || product.id,
        1
      );
      if (response.success) {
        await loadCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      if (response.success) {
        await loadCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const response = await cartService.updateCartItem(itemId, newQuantity);
      if (response.success) {
        await loadCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const toggleWishlist = (product) => {
    const existingIndex = wishlist.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
      return false;
    } else {
      setWishlist([...wishlist, product]);
      return true;
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        cartTotal,
        cartCount,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
