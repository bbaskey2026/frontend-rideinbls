import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // reuse same layout
import API_ENDPOINTS from "../config/api";  
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }); // ✅ use centralized endpoint
      if (response.data.success) {
        setMessage("OTP sent to your email. Please check your inbox.");
        // Redirect to OTP verification / reset password page
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setMessage(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server error!");
    }

    setLoading(false);
  };

  return (
    <div className="register-page">
      {/* Left Side */}
      <div className="register-left">
        <h1 className="welcome-title">Welcome Back to RideInBls.com</h1>
  {/* Replace welcome title & text with brand logo */}
  <div className="brand-logo-container">
    
    <img
      src="./src/assets/bhu.jpg"  // <-- your logo path
      alt="RideInBls Logo"
      className="brand-logo"
    />
  </div>
      </div>

      {/* Right Side */}
      <div className="register-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Reset Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          {message && <p className="info-text">{message}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <p className="form-footer">
            Remembered your password?{" "}
            <span className="link-text" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
