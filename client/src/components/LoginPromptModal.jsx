import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ no curly braces

export default function LoginPromptModal({ show, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        const decodedUser = jwtDecode(data.token); // ✅ decode token
        localStorage.setItem("token", data.token); // ✅ store token
        onLoginSuccess(decodedUser); // ✅ update user state in App.js
        onClose(); // ✅ close modal
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Login Required</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleLogin}>
            <div className="modal-body">
              <p>You must be logged in to add items to your cart.</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => {
                    onClose();
                    navigate("/register");
                  }}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loggingIn}
              >
                {loggingIn ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
