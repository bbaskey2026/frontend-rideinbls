import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import OtpModal from "../components/OtpModal"; // ✅ Reuse same OTP modal
import "./Register.css"; // Reuse layout styles
import API_ENDPOINTS from "../config/api";
function Login() {
  const { login, verifyLoginOtp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await login(email, password);

    if (result.success) {
      setShowOtpModal(true); // 👈 Open OTP modal
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");
    const result = await verifyLoginOtp(email, otp);

    if (result.success) {
      setShowOtpModal(false); // Close modal after success
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setMessage(result.message || "Invalid OTP. Try again.");
    }

    setLoading(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setMessage("");

    try {
    
const response = await axios.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
      if (response.data.success) {
        setMessage("New OTP sent! Check your email.");
      } else {
        setMessage(response.data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error!");
    }

    setResendLoading(false);
  };

  return (
    <div className="register-page">
      {/* Left Side: Image + Text */}
      <div className="register-left">
        <img
          src="./src/assets/bg.png"
          alt="BLS Ride Login"
          className="register-image"
        />
        <h1 className="welcome-title">Welcome Back to RideInBls.com</h1>
        <p className="welcome-text">
          Access your account and enjoy smooth booking, real-time updates, and
          a safe travel experience with BLS Ride. Login now to continue your journey.
        </p>
      </div>

      {/* Right Side: Login Form */}
      <div className="register-right">
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="login-title">Login</h2>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          {/* Forgot Password */}
          <p className="form-footer">
            <span
              className="link-text"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </p>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Sending OTP..." : "Login"}
          </button>

          {/* Register */}
          <p className="form-footer">
            Don’t have an account?{" "}
            <span className="link-text" onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </form>
      </div>

      {/* OTP Modal */}
      <OtpModal
        email={email}
        isOpen={showOtpModal}
        otp={otp}
        setOtp={setOtp}
        loading={loading}
        message={message}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        resendLoading={resendLoading}
      />
    </div>
  );
}

export default Login;
