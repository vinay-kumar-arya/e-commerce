import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import "../../App.css";

export default function ProductsPage({
  products,
  setProducts,
  searchTerm,
  loggedInUser,
  setLoggedInUser,
  setShowLoginModal,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const api_url = import.meta.env.VITE_REACT_APP_API;

        const res = await axios.get(`${api_url}/api/category/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories([{ name: "All", _id: null }, ...res.data.data]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch paginated products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const api_url = import.meta.env.VITE_REACT_APP_API;
      try {
        const res = await axios.get(
          `${api_url}/api/product/get?limit=${PRODUCTS_PER_PAGE}&page=${currentPage}`
        );
        setProducts(res.data.products);
        setTotalProducts(res.data.totalCount || res.data.total || 0);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, setProducts]);

  // ✅ Filter logic based on category and search
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <div className="container-fluid py-5 flex-grow-1">
        <div className="row">
          {/* Sidebar - Category Filter */}
          <div className="col-md-2 mb-4">
            <div
              className="card sticky-top"
              style={{
                top: "70px", // adjust based on your Navbar height
                height: "calc(100vh - 70px)",
                overflowY: "auto",
              }}
            >
              <div className="card-header fw-bold">Filter by Category</div>
              <ul className="list-group list-group-flush">
                {categories.map((cat) => (
                  <li
                    key={cat.name}
                    className={`list-group-item ${
                      selectedCategory === cat.name ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-md-10">
            <h2 className="mb-4">Featured Products</h2>

            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : filteredProducts.length > 0 ? (
              <div className="row">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                    setShowLoginModal={setShowLoginModal}
                  />
                ))}
              </div>
            ) : (
              <p>No products found.</p>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && totalPages > 1 && (
              <nav className="mt-4 d-flex justify-content-center">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
