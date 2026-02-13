import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
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
  const cartLoadedRef = useRef(false);

  // Load cart from localStorage or backend
  useEffect(() => {
    if (isLoggedIn) {
      syncAndLoadCart();
    } else {
      loadLocalCart();
    }
  }, [isLoggedIn]);

  // Save cart to localStorage when it changes (for guest users)
  // Only save AFTER the cart has been initially loaded to prevent overwriting with []
  useEffect(() => {
    if (!isLoggedIn && cartLoadedRef.current) {
      localStorage.setItem("guestCart", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem("guestCart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error loading local cart:", error);
      setCart([]);
    } finally {
      cartLoadedRef.current = true;
    }
  };

  const syncAndLoadCart = async () => {
    try {
      setLoading(true);

      // Check if there's a guest cart to sync
      const guestCart = localStorage.getItem("guestCart");
      if (guestCart) {
        const localItems = JSON.parse(guestCart);
        if (localItems.length > 0) {
          // Sync guest cart to backend
          await cartService.syncCart(localItems);
          // Clear localStorage cart after sync
          localStorage.removeItem("guestCart");
        }
      }

      // Load cart from backend
      await loadCart();
    } catch (error) {
      console.error("Error syncing cart:", error);
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        // Transform backend cart format to frontend format
        // Filter out items with null productId (deleted products)
        const transformedCart =
          response.data.items
            ?.filter((item) => item.productId != null)
            .map((item) => ({
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

  const addToCart = async (product, quantity = 1) => {
    if (!isLoggedIn) {
      // Add to local cart for guest users
      const existingItemIndex = cart.findIndex(
        (item) => item.productId === (product._id || product.id),
      );

      if (existingItemIndex > -1) {
        // Update quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        // Add new item
        const newItem = {
          id: Date.now().toString(), // Temporary ID for local cart
          productId: product._id || product.id,
          name: product.name,
          price: product.pricing?.offerPrice || product.price,
          quantity: quantity,
          image: product.images?.[0] || product.image || "",
          stock: product.stock,
        };
        setCart([...cart, newItem]);
      }
      toast.success("Item added to cart");
      return;
    }

    // Add to backend cart for logged-in users
    try {
      const response = await cartService.addToCart(
        product._id || product.id,
        quantity,
      );
      if (response.success) {
        await loadCart();
        toast.success("Item added to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error.response?.data?.message || "Failed to add item to cart",
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isLoggedIn) {
      // Remove from local cart for guest users
      setCart(cart.filter((item) => item.id !== itemId));
      return;
    }

    // Remove from backend cart for logged-in users
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

    if (!isLoggedIn) {
      // Update local cart for guest users
      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      );
      setCart(updatedCart);
      return;
    }

    // Update backend cart for logged-in users
    try {
      const response = await cartService.updateCartItem(itemId, newQuantity);
      if (response.success) {
        await loadCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn) {
      // Clear local cart for guest users
      setCart([]);
      localStorage.removeItem("guestCart");
      return;
    }

    // Clear backend cart for logged-in users
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
    0,
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
