import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="shop-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">MyShop</div>

          <nav className="footer-links">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MyShop. All rights reserved.</span>
          <span className="footer-author">Made by Vinay Arya</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
