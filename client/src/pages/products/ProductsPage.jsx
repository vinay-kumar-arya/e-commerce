import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/Product-Card/ProductCard";
import "./ProductsPage.css";
import { FiLayers } from "react-icons/fi";
import ProductCardSkeleton from "../../components/Product-Card/ProductCardSkeleton";

export default function ProductsPage({
  products,
  setProducts,
  searchTerm,
  loggedInUser,
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
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategories([{ name: "All", _id: null }, ...res.data.data]);
      } catch {}
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const api_url = import.meta.env.VITE_REACT_APP_API;

      try {
        const res = await axios.get(
          `${api_url}/api/product/get?limit=${PRODUCTS_PER_PAGE}&page=${currentPage}`,
        );
        setProducts(res.data.products);
        setTotalProducts(res.data.totalCount || 0);
        setError(null);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, setProducts]);

  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>Featured Products</h1>
          <p>Discover our curated collection</p>
        </div>

        <div className="row">
          <aside className="col-xl-2 col-lg-3">
            <div className="filter-panel">
              <h4>
                <FiLayers size={16} /> Categories
              </h4>

              <ul>
                {categories.map((cat) => (
                  <li
                    key={cat.name}
                    className={selectedCategory === cat.name ? "active" : ""}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="col-xl-10 col-lg-9">
            {loading ? (
              <div className="row g-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={i}>
                    <ProductCardSkeleton />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : filteredProducts.length ? (
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                  >
                    <ProductCard
                      product={product}
                      loggedInUser={loggedInUser}
                      setShowLoginModal={setShowLoginModal}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No products found</div>
            )}

            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
