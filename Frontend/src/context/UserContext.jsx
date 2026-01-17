import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/apiService";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setCurrentUser(userData);
          setIsLoggedIn(true);
          setIsAdmin(userData.role === "admin");
        } catch (error) {
          console.error("Error loading user:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Check for token in URL (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      handleOAuthCallback(token);
    }
  }, []);

  const handleOAuthCallback = async (token) => {
    try {
      localStorage.setItem("token", token);
      const response = await authService.getCurrentUser();
      if (response.success) {
        const userData = response.data;
        setCurrentUser(userData);
        setIsLoggedIn(true);
        setIsAdmin(userData.role === "admin");
        localStorage.setItem("user", JSON.stringify(userData));

        // Remove token from URL
        window.history.replaceState({}, document.title, "/");
      }
    } catch (error) {
      console.error("OAuth callback error:", error);
      localStorage.removeItem("token");
    }
  };

  const loginWithGoogle = () => {
    authService.loginWithGoogle();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isAdmin,
        loading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
