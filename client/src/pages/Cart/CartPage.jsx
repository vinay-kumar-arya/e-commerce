import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/user/cart", {
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
      await axios.delete(
        `http://localhost:8000/api/user/cart/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
        `http://localhost:8000/api/user/cart/product/${item.productId._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Re-add with updated quantity
      await axios.post(
        "http://localhost:8000/api/user/cart/add",
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
    <div className="container py-5">
      <h2 className="mb-4">Your Shopping Cart</h2>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Total (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...cart.products]
              .sort((a, b) => a.productId.name.localeCompare(b.productId.name))
              .map((item) => (
                <tr key={item.productId._id}>
                  <td>
                    <img
                      src={item.productId.imageUrl.replace(
                        "localhost",
                        "localhost"
                      )}
                      alt={item.productId.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{item.productId.name}</td>
                  <td>{item.productId.price.toFixed(2)}</td>
                  <td className="d-flex gap-2 align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleChangeQuantity(item, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleChangeQuantity(item, 1)}
                    >
                      +
                    </button>
                  </td>
                  <td>{item.totalPrice.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveItem(item.productId._id)}
                    >
                      <i
                        className="bi bi-trash-fill text-white"
                        style={{ fontSize: "1rem" }}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h5>
          <strong>Total: ₹{cart.grandTotalPrice.toFixed(2)}</strong>
        </h5>
        <button className="btn btn-success" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
