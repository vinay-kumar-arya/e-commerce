import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginPromptModal from "./LoginPromptModal";
import { toast } from "react-toastify";

const ProductCard = ({
  product,
  loggedInUser,
  setLoggedInUser,
  setShowLoginModal,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!loggedInUser || !token) return;

    axios
      .get("http://localhost:8000/api/user/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const item = res.data.products.find(
          (p) => p.productId._id === product._id
        );
        if (item) setQuantity(Number(item.quantity));
      })
      .catch((err) => console.error("Fetch quantity error", err));
  }, [product._id, loggedInUser, token]);

  const handleAddToCart = async () => {
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8000/api/user/cart/add",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuantity(1);
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className={`card h-100 shadow ${loading ? "opacity-50" : ""}`}>
        {/* ✅ Image updated for full width + fixed height */}
        <img
          src={product?.imageUrl}
          className="card-img-top"
          alt={product?.name}
          style={{
            height: "250px", // consistent image height
            objectFit: "contain", // full image fit
            cursor: "pointer",
          }}
          onClick={() => navigate(`/product/${product._id}`)}
        />

        <div className="card-body d-flex flex-column">
          {/* ✅ Name and Price aligned in same row */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0">{product?.name}</h5>
            <span className="fw-bold text-muted">₹{product?.price}</span>
          </div>

          {/* Add/Go to cart button */}
          {quantity === 0 ? (
            <button
              className="btn btn-primary mt-auto"
              onClick={handleAddToCart}
              disabled={loading}
            >
              Add to Cart
            </button>
          ) : (
            <button
              className="btn btn-success mt-auto"
              onClick={() => navigate("/cart")}
            >
              Go to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
