import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import API_ENDPOINTS from "../config/api";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email"); // get email from URL

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
  email,
  otp,
  newPassword,
});

      if (response.data.success) {
        setMessage("Password reset successfully!");
        setTimeout(() => navigate("/login"), 1500);
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
      <div className="register-left">


      
        <h1 className="welcome-title">Reset Your Password</h1>
        <p className="welcome-text">
          Enter the OTP sent to <strong>{email}</strong> and choose a new password.
        </p>
      </div>

      <div className="register-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Reset Password</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="login-input"
          />
          {message && <p className="info-text">{message}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
