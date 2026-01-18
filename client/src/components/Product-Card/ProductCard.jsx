import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ProductCard.css";

const ProductCard = ({ product, loggedInUser, setShowLoginModal }) => {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const isOutOfStock = product.stock === 0;
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  useEffect(() => {
    if (!loggedInUser || !token) return;
    const api_url = import.meta.env.VITE_REACT_APP_API;

    axios
      .get(`${api_url}/api/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const item = res.data.products.find(
          (p) => p.productId._id === product._id
        );
        if (item) setQuantity(Number(item.quantity));
      })
      .catch(() => {});
  }, [product._id, loggedInUser, token]);

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }

    try {
      setLoading(true);
      const api_url = import.meta.env.VITE_REACT_APP_API;

      await axios.post(
        `${api_url}/api/user/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuantity(1);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`product-card ${loading ? "loading" : ""}`}>
      <div
        className="product-image"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {hasDiscount && (
          <span className="discount-badge">{discountPercent}% OFF</span>
        )}

        {isOutOfStock && <span className="stock-badge">Out of stock</span>}

        <img src={product.imageUrl} alt={product.name} />
      </div>

      <div className="product-info">
        <h3 title={product.name}>{product.name}</h3>

        <div className="price-row">
          <span className="price">₹{product.price}</span>

          {hasDiscount && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>

        {quantity === 0 ? (
          <button
            className="product-btn"
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
          >
            {isOutOfStock ? "Unavailable" : "Add to cart"}
          </button>
        ) : (
          <button
            className="product-btn outline"
            onClick={() => navigate("/cart")}
          >
            Go to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
