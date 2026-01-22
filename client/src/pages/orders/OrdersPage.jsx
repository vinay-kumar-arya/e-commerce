import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./OrdersPage.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_REACT_APP_API;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/order/get`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 1,
          limit: 50,
        },
      });

      if (res.data.success) {
        setOrders(res.data.data || []);
        setError(null);
      } else {
        setError(res.data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
      if (err.response?.status === 401) {
        toast.error("Please login to view your orders");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "badge bg-warning",
      processing: "badge bg-info",
      shipped: "badge bg-primary",
      delivered: "badge bg-success",
      cancelled: "badge bg-danger",
    };
    return statusClasses[status] || "badge bg-secondary";
  };

  const orderSteps = ["pending", "processing", "shipped", "delivered"];

  const getOrderProgress = (status) => {
    if (!status) return { percent: 0, stepIndex: 0, isCancelled: false };
    if (status === "cancelled") {
      return { percent: 100, stepIndex: -1, isCancelled: true };
    }

    const idx = orderSteps.indexOf(status);
    if (idx === -1) return { percent: 0, stepIndex: 0, isCancelled: false };
    const percent = Math.round(((idx + 1) / orderSteps.length) * 100);
    return { percent, stepIndex: idx, isCancelled: false };
  };

  const formatStepLabel = (step) => {
    if (!step) return "";
    return step.charAt(0).toUpperCase() + step.slice(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={fetchOrders}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "1000px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="card p-5 text-center">
          <h5 className="text-muted">No orders found</h5>
          <p className="text-muted">
            You haven't placed any orders yet. Start shopping!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="card mb-4">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h5 className="mb-1">Order #{order.orderId}</h5>
                    <small className="text-muted">
                      Placed on {formatDate(order.orderedAt)}
                    </small>
                  </div>
                  <div className="mt-2 mt-md-0">
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {(() => {
                  const { percent, stepIndex, isCancelled } = getOrderProgress(
                    order.status,
                  );
                  return (
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">Order progress</small>
                        <small
                          className={
                            isCancelled ? "text-danger fw-semibold" : "text-muted"
                          }
                        >
                          {isCancelled
                            ? "Cancelled"
                            : `${formatStepLabel(order.status)} (${percent}%)`}
                        </small>
                      </div>

                      <div className="order-progress-track">
                        <div
                          className={
                            "order-progress-fill" +
                            (isCancelled ? " is-cancelled" : "")
                          }
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="order-progress-steps">
                        {orderSteps.map((step, i) => {
                          const isActive = !isCancelled && i <= stepIndex;
                          return (
                            <div className="order-progress-step" key={step}>
                              <div
                                className={
                                  "order-progress-dot" +
                                  (isActive ? " is-active" : "") +
                                  (isCancelled ? " is-cancelled" : "")
                                }
                                aria-hidden="true"
                              />
                              <small className="order-progress-label">
                                {formatStepLabel(step)}
                              </small>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                <div className="row">
                  <div className="col-md-8">
                    <h6 className="mb-3">Products</h6>
                    {order.products?.map((product, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center mb-3 pb-3 border-bottom"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="order-product-image me-3"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{product.name}</h6>
                          <small className="text-muted">
                            Quantity: {product.quantity} × ₹{product.price} =
                            ₹{product.total}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-md-4">
                    <div className="order-summary">
                      <h6 className="mb-3">Order Summary</h6>
                      <div className="mb-2">
                        <strong>Payment Method:</strong>{" "}
                        <span className="text-capitalize">
                          {order.paymentMethod || "N/A"}
                        </span>
                      </div>
                      {order.shippingAddress && (
                        <div className="mb-3">
                          <strong>Shipping Address:</strong>
                          <p className="mb-0 small text-muted">
                            {order.shippingAddress.street},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.postalCode}
                          </p>
                        </div>
                      )}
                      <div className="border-top pt-3">
                        <h5 className="d-flex justify-content-between">
                          <span>Total:</span>
                          <span className="text-primary">
                            ₹{order.totalPrice}
                          </span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
