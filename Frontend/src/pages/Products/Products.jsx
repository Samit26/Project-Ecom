import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { productService } from "../../services/apiService";
import { useSearch } from "../../context/SearchContext";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { searchQuery, updateSearchQuery } = useSearch();
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Sync with global search query from Header
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, sortBy, sortOrder, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        sortBy,
        order: sortOrder,
      };

      if (activeCategory !== "all") {
        params.category = activeCategory;
      }

      // Only include search if it's at least 3 characters
      if (searchQuery && searchQuery.length >= 3) {
        params.search = searchQuery;
      }

      const response = await productService.getAllProducts(params);
      if (response.success) {
        setProducts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery.length >= 3 || localSearchQuery.length === 0) {
        updateSearchQuery(localSearchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, updateSearchQuery]);

  const handleSearchInput = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (localSearchQuery.length >= 3) {
      updateSearchQuery(localSearchQuery);
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

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const getBadgeText = (product) => {
    if (product.category === "Smart Lighting") return "SMART";
    if (product.category === "LED Lights") return "LED";
    if (product.isFeatured) return "FEATURED";
    return "NEW";
  };

  return (
    <div className="page">
      <div className="products-header">
        <h1 className="section-title">Our Products</h1>

        {/* Search Bar */}
        <div className="search-form">
          <input
            type="text"
            placeholder="Search products (min 3 characters)..."
            value={localSearchQuery}
            onChange={handleSearchInput}
            onKeyPress={handleSearchKeyPress}
            className="search-input"
          />
          <button onClick={handleSearchClick} className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Sort Controls */}
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
          <button onClick={handleOrderChange} className="order-btn">
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>
        </div>

        <div className="category-filter">
          <button
            className={`category-btn ${
              activeCategory === "all" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("all")}
          >
            All Products
          </button>
          <button
            className={`category-btn ${
              activeCategory === "LED Lights" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("LED Lights")}
          >
            LED Lights
          </button>
          <button
            className={`category-btn ${
              activeCategory === "Smart Lighting" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("Smart Lighting")}
          >
            Smart Lighting
          </button>
          <button
            className={`category-btn ${
              activeCategory === "Decorative" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("Decorative")}
          >
            Decorative
          </button>
          <button
            className={`category-btn ${
              activeCategory === "Outdoor" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("Outdoor")}
          >
            Outdoor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  image: product.images?.[0] || "",
                  price: product.pricing.offerPrice,
                  oldPrice: product.pricing.originalPrice,
                }}
                badgeText={getBadgeText(product)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
