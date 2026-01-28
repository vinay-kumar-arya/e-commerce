import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import loadRazorpay from "../../utils/loadRazorpay";
import "./CheckoutPage.css";

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
      res.data.addressList.find((item) => {
        console.log(item);
        if (item.isDefault) {
          setSelectedAddressId(item.addressId);
        }
      });
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
      await axios.post(
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
        name: "ShopNexa",
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
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Secure Checkout</h1>
        <p>Complete your purchase in just one step</p>
      </div>

      <div className="checkout-grid">
        <div className="checkout-left">
          <div className="checkout-card">
            <h3>Delivery Address</h3>

            {addressList.length === 0 && (
              <div className="empty-state">No saved address found</div>
            )}

            {addressList.map((addr) => (
              <label
                key={addr.addressId}
                className={`address-tile ${
                  selectedAddressId === addr.addressId ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr.addressId}
                  onChange={() => setSelectedAddressId(addr.addressId)}
                />
                <div>
                  {addr.fullAddress ||
                    `${addr.street}, ${addr.city}, ${addr.state}, ${addr.postalCode}`}{" "}
                  <i>
                    <sup>{addr.isDefault ? "Default address" : ""}</sup>
                  </i>
                </div>
              </label>
            ))}
          </div>

          <div className="checkout-card">
            <h3>Payment Method</h3>

            <div className="payment-grid">
              {["COD", "CARD", "UPI", "NETBANKING"].map((method) => (
                <button
                  key={method}
                  className={`payment-pill ${
                    paymentMethod === method ? "active" : ""
                  }`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-items">
              {cart.products.map((item) => (
                <div key={item.productId._id} className="summary-row">
                  <span>
                    {item.productId.name} × {item.quantity}
                  </span>
                  <span>₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{cart.grandTotalPrice}</span>
            </div>

            <button className="checkout-btn" onClick={handlePayment}>
              {paymentMethod === "COD" ? "Place Order" : "Pay Securely"}
            </button>

            <p className="secure-note">SSL encrypted • 100% secure payments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
