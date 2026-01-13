import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProductDetail = ({ loggedInUser }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/product/get/${productId}`
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found.");
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !productId) return;

        const res = await axios.get("http://localhost:8000/api/user/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartItem = res.data.products.find(
          (item) => item.productId._id === productId
        );

        if (cartItem) {
          setQuantity(Number(cartItem.quantity));
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartQuantity();
  }, [productId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // alert("Please login first.");
      toast.error("Please login first.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8000/api/user/cart/add",
        {
          productId,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuantity(1);
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <div className="container py-5">
        <h3 className="text-danger">{error}</h3>
      </div>
    );

  if (!product)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
        <p>Loading product...</p>
      </div>
    );

  const originalPrice = product.price + 3000;

  return (
    <div className="container py-5">
      <div className="row">
        {/* LEFT - IMAGE */}
        <div className="col-md-5">
          <div className="border p-3 bg-white">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="img-fluid w-100"
              style={{ height: "450px", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div className="col-md-7">
          <h1 className="fw-bold border text-center">{product.name}</h1>
          <h3 className="text-muted text-center py-2">
            Category:{" "}
            <strong>{product.category?.name || "Uncategorized"}</strong>
          </h3>
          <h3 className="text-muted text-center py-2">
            Price: <strong>₹{product.price}</strong>
          </h3>
          <h3 className="mb-0">
            <del className="text-muted">₹{originalPrice}</del>{" "}
            <span className="text-danger">50% off</span>
          </h3>
          <h3 className="text-muted text-center py-2">
            Description:{" "}
            <strong>{product.description || "No description"}</strong>
          </h3>

          {/* Cart Buttons */}
          {loggedInUser ? (
            <div className="text-center">
              {quantity === 0 ? (
                <button
                  className="btn btn-warning fw-bold w-100 py-3 fs-5 mt-4"
                  style={{ maxWidth: "400px" }}
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  🛒 ADD TO CART
                </button>
              ) : (
                <button
                  className="btn btn-success fw-bold w-100 py-3 fs-5 mt-4"
                  style={{ maxWidth: "400px" }}
                  onClick={() => navigate("/cart")}
                >
                  ✅ GO TO CART
                </button>
              )}
            </div>
          ) : (
            <p className="text-muted mt-4">
              <i>Please login to add this product to your cart.</i>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
