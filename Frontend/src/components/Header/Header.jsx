import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useSearch } from "../../context/SearchContext";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { cartCount } = useCart();
  const { isLoggedIn, isAdmin, currentUser, loginWithGoogle, logout } =
    useUser();
  const { updateSearchQuery } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogin = () => {
    loginWithGoogle();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleAdminClick = () => {
    if (isLoggedIn && isAdmin) {
      navigate("/admin");
    } else if (isLoggedIn) {
      alert("You do not have admin access");
    } else {
      alert("Please login first");
    }
  };

  // Debounce search query - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery.length >= 3 || localSearchQuery.length === 0) {
        updateSearchQuery(localSearchQuery);
        // Navigate to products page if not already there and search is active
        if (localSearchQuery.length >= 3 && location.pathname !== "/products") {
          navigate("/products");
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, updateSearchQuery, navigate, location.pathname]);

  const handleSearchInput = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (localSearchQuery.length >= 3) {
      updateSearchQuery(localSearchQuery);
      if (location.pathname !== "/products") {
        navigate("/products");
      }
    } else if (localSearchQuery.length > 0 && localSearchQuery.length < 3) {
      alert("Please enter at least 3 characters to search");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <header>
      <div className="header-top">
        <div className="container">
          <div className="top-left">Free shipping on orders above ₹2000</div>
          <div className="top-right">
            {isLoggedIn && isAdmin && (
              <a
                href="#"
                style={{ marginRight: "15px" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleAdminClick();
                }}
              >
                <i className="fas fa-cog"></i> Admin Panel
              </a>
            )}
            {isLoggedIn ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                <i className="fas fa-sign-out-alt"></i> Logout (
                {currentUser?.name})
              </a>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <i className="fas fa-sign-in-alt"></i> Login with Google
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="container">
          <Link to="/" className="logo">
            <i className="fas fa-lightbulb"></i>
            <div>
              <h1>
                AJEET <span>LIGHTS</span>
              </h1>
              <div className="slogan">We Light Up Your Homes</div>
            </div>
          </Link>

          <nav className={mobileMenuOpen ? "active" : ""}>
            <ul>
              <li>
                <Link
                  to="/"
                  className={isActive("/") ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={isActive("/about") ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className={isActive("/products") ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for lights..."
                value={localSearchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleSearchKeyPress}
              />
              <button onClick={handleSearchClick}>
                <i className="fas fa-search"></i>
              </button>
            </div>
            <Link to="/cart" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <Link to="/profile" className="user-icon">
              <i className="fas fa-user"></i>
              {isLoggedIn && <span className="user-count"></span>}
            </Link>
            <div
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i
                className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
