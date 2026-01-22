import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiBox,
  FiLogOut,
} from "react-icons/fi";

import "./Navbar.css";

export default function Navbar({
  loggedInUser,
  setLoggedInUser,
  setSearchTerm,
  cartCount = 0,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
    navigate("/login");
    toast.success("Logged out");
  };

  return (
    <header
      className={`shop-navbar fixed-top ${
        location.pathname !== "/" ? "no-search" : ""
      }`}
    >
      <div className="navbar-inner">
        {/* Left */}
        <div className="nav-left">
          <button className="brand" onClick={() => navigate("/")}>
            MyShop
          </button>
        </div>

        {/* Center */}
        {location.pathname === "/" && (
          <div className="nav-center">
            <FiSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search products"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Right */}
        <div className="nav-right">
          {loggedInUser ? (
            <div className="user-dropdown dropdown">
              <button
                className="user-btn dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FiUser size={16} />
                <span>{loggedInUser.name}</span>
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/profile")}
                  >
                    <FiUser className="dd-icon" />
                    My Profile
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/orders")}
                  >
                    <FiBox className="dd-icon" />
                    My Orders
                  </button>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="dd-icon" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}

          <button
            className="cart-btn"
            onClick={() =>
              loggedInUser ? navigate("/cart") : toast.error("Login first")
            }
          >
            <FiShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && <em>{cartCount}</em>}
          </button>
        </div>
      </div>
    </header>
  );
}
