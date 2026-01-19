import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Profile from "./pages/Profile/Profile";
import Cart from "./pages/Cart/Cart";
import Admin from "./pages/Admin/Admin";
import Contact from "./pages/Contact/Contact";
import FAQ from "./pages/FAQ/FAQ";
import ShippingPolicy from "./pages/ShippingPolicy/ShippingPolicy";
import ReturnExchange from "./pages/ReturnExchange/ReturnExchange";
import PrivacyPolicy from "./pages/Policy/Policy";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { SearchProvider } from "./context/SearchContext";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <SearchProvider>
          <Router>
            <ScrollToTop />
            <div className="app">
              <Header />
              <main className="container main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/return-exchange" element={<ReturnExchange />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route
                    path="/order-confirmation/:orderNumber"
                    element={<OrderConfirmation />}
                  />
                </Routes>
              </main>
              <Footer />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </Router>
        </SearchProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
