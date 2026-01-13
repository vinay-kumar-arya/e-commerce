import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Login = ({ setLoggedInUser }) => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    new_email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/user/login",
        // "http://192.168.84.219:8000/api/user/login",
        // "http://10.155.196.219:8000/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      console.log("data", data);

      if (response.ok && data.success) {
        const decodedUser = jwtDecode(data.token);
        localStorage.setItem("token", data.token);
        setLoggedInUser(decodedUser);
        // alert("Login successful!");
        toast.success("Login successful!");
        navigate("/");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto shadow p-4 rounded">
          <h2 className="mb-4 text-center">Login</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter email"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>
          <div className="d-flex justify-content-center align-items-center mt-4">
            <span>
              Does not have an account? Register
              <a href="/register" className="text-decoration-none">
                {" "}
                here
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
