import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ProductsPage.css";

const ProductDetail = ({ loggedInUser }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const api = import.meta.env.VITE_REACT_APP_API;

  useEffect(() => {
    axios
      .get(`${api}/api/product/get/${productId}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found"));
  }, [productId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${api}/api/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const item = res.data.products.find(
          (i) => i.productId._id === productId
        );
        if (item) setQuantity(item.quantity);
      })
      .catch(() => {});
  }, [productId]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");

    try {
      setLoading(true);
      await axios.post(
        `${api}/api/user/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuantity(1);
      toast.success("Added to cart");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="container py-5">{error}</div>;
  if (!product) return <div className="container py-5">Loading…</div>;

  const originalPrice = product.price + 3000;

  return (
    <section className="product-detail">
      <div className="product-detail-container">
        <div className="product-media">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-meta">
          <span className="category">
            {product.category?.name || "General"}
          </span>

          <h1>{product.name}</h1>

          <div className="price-block">
            <span className="price">₹{product.price}</span>
            <span className="original">₹{originalPrice}</span>
            <span className="discount">50% off</span>
          </div>

          <p className="description">
            {product.description || "No description available."}
          </p>

          {loggedInUser ? (
            quantity === 0 ? (
              <button
                className="primary-btn"
                onClick={addToCart}
                disabled={loading}
              >
                Add to cart
              </button>
            ) : (
              <button
                className="primary-btn outline"
                onClick={() => navigate("/cart")}
              >
                Go to cart
              </button>
            )
          ) : (
            <p className="login-hint">Login to purchase this product</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
