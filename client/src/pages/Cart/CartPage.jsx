import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api_url = import.meta.env.VITE_REACT_APP_API;

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api_url}/api/user/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart.");
      // if (err.response?.status === 404) {
      //   // Handle empty cart
      //   setCart({ products: [], grandTotalPrice: 0 });
      //   setError(null); // No error, just empty cart
      // } else {
      //   console.error("Error fetching cart:", err);
      //   setError("Failed to load cart.");
      // }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`${api_url}/api/user/cart/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Error removing item:", err);
    }
  };

  const handleChangeQuantity = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      await handleRemoveItem(item.productId._id);
      return;
    }

    try {
      setLoading(true);

      // Delete the existing item
      await axios.delete(
        `${api_url}/api/user/cart/product/${item.productId._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Re-add with updated quantity
      await axios.post(
        `${api_url}/api/user/cart/add`,
        {
          productId: item.productId._id,
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchCart();
      toast.info(
        `Quantity has been ${delta > 0 ? "increased" : "decreased"} by 1`
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  if (loading) return <p className="text-center mt-5">Loading cart...</p>;

  if (!cart || cart.products?.length === 0) {
    return (
      <div className="container text-center mt-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty Cart"
          width="100"
          height="100"
          className="mb-4"
        />
        <h3 className="mb-2">Your cart is empty</h3>
        <p className="text-muted mb-3">
          Looks like you haven't added anything yet.
        </p>
        <a href="/" className="btn btn-outline-primary">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* LEFT - ITEMS */}
        <div className="cart-items">
          <h2>Your Cart</h2>

          {cart.products.map((item) => (
            <div className="cart-item" key={item.productId._id}>
              <img src={item.productId.imageUrl} alt={item.productId.name} />

              <div className="item-info">
                <h4>{item.productId.name}</h4>
                <p className="price">₹{item.productId.price}</p>

                <div className="qty-control">
                  <button onClick={() => handleChangeQuantity(item, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleChangeQuantity(item, 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="item-actions">
                <span className="total">₹{item.totalPrice}</span>
                <button
                  className="remove"
                  onClick={() => handleRemoveItem(item.productId._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cart.grandTotalPrice}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{cart.grandTotalPrice}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
