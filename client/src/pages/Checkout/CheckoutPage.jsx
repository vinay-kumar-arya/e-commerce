import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import loadRazorpay from "../../utils/loadRazorpay";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const apiUrl = import.meta.env.VITE_REACT_APP_API;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* Fetch cart & address */
  useEffect(() => {
    fetchCart();
    fetchAddress();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch {
      toast.error("Failed to load cart");
    }
  };

  const fetchAddress = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/user/getAddress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddressList(res.data.addressList || []);
    } catch {
      toast.error("Failed to load address");
    }
  };

  /* Handle COD order */
  const placeCODOrder = async () => {
    if (!selectedAddressId) {
      return toast.error("Please select an address");
    }

    try {
      const res = await axios.post(
        `${apiUrl}/api/order/create`,
        {
          addressId: selectedAddressId,
          paymentMethod: "COD",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Order placed successfully!");
      // Redirect to orders page
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  /* Razorpay payment */
  const payOnline = async () => {
    if (!selectedAddressId) {
      return toast.error("Please select an address");
    }

    if (!paymentMethod) {
      return toast.error("Please select a payment method");
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      return toast.error("Razorpay SDK failed to load");
    }

    try {
      const { data } = await axios.post(
        `${apiUrl}/api/payment/create-order`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "MyShop",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await axios.post(
              `${apiUrl}/api/payment/varify`,
              {
                ...response,
                addressId: selectedAddressId,
                paymentMethod,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            toast.success("Payment successful");
            // Redirect to orders page
            setTimeout(() => {
              navigate("/orders");
            }, 1500);
          } catch {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#2563eb" },
      };

      if (!window.Razorpay) {
        console.error("Razorpay SDK not available on window");
        return toast.error("Payment service unavailable. Please try again.");
      }

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  /* Handle payment based on selected method */
  const handlePayment = () => {
    if (paymentMethod === "COD") {
      placeCODOrder();
    } else {
      payOnline();
    }
  };

  if (!cart) {
    return <p className="text-center mt-5">Loading checkout...</p>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4">Checkout</h2>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Select Address</h5>

        {addressList.length === 0 && (
          <p className="text-muted">No address found</p>
        )}

        {addressList.map((addr) => (
          <div className="form-check mb-2" key={addr.addressId}>
            <input
              type="radio"
              className="form-check-input"
              name="address"
              checked={selectedAddressId === addr.addressId}
              onChange={() => setSelectedAddressId(addr.addressId)}
            />
            <label className="form-check-label">
              {addr.fullAddress ||
                `${addr.street}, ${addr.city}, ${addr.state}, ${addr.postalCode}`}
            </label>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Order Summary</h5>

        {cart.products.map((item) => (
          <div
            key={item.productId._id}
            className="d-flex justify-content-between mb-2"
          >
            <span>
              {item.productId.name} × {item.quantity}
            </span>
            <span>₹{item.totalPrice}</span>
          </div>
        ))}

        <hr />
        <div className="mb-3">
          <h6 className="mb-2">Payment Method</h6>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="pmCOD"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="pmCOD">
              Cash on Delivery (COD)
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="pmCard"
              value="CARD"
              checked={paymentMethod === "CARD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="pmCard">
              Card
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="pmUpi"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="pmUpi">
              UPI
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="pmNetbanking"
              value="NETBANKING"
              checked={paymentMethod === "NETBANKING"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="pmNetbanking">
              Netbanking
            </label>
          </div>
        </div>
        <h5 className="d-flex justify-content-between mb-0">
          <span>Total</span>
          <span>₹{cart.grandTotalPrice}</span>
        </h5>
      </div>

      <button className="btn btn-primary w-100" onClick={handlePayment}>
        {paymentMethod === "COD" ? "Place Order" : "Pay with Razorpay"}
      </button>
    </div>
  );
}
