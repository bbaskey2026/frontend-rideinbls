import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Smartphone } from "lucide-react";
import AuthContext from "../context/AuthContext";
import OtpModal from "../components/OtpModal";
import "./Login.css";
import API_ENDPOINTS from "../config/api";

function Login() {
  const { login, verifyLoginOtp } = useContext(AuthContext);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "mobile"
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
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
    
    // Pass either email or mobile based on login method
    const identifier = loginMethod === "email" ? email : mobile;
    const result = await login(identifier, password, loginMethod);

    if (result.success) {
      setShowOtpModal(true);
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");
    const identifier = loginMethod === "email" ? email : mobile;
    const result = await verifyLoginOtp(identifier, otp, loginMethod);

    if (result.success) {
      setShowOtpModal(false);
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
      const identifier = loginMethod === "email" ? email : mobile;
      const response = await axios.post(API_ENDPOINTS.AUTH.RESEND_OTP, { 
        [loginMethod]: identifier 
      });
      
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
        <h1 className="welcome-title">Welcome Back to RideInBls.com</h1>
        <div className="brand-logo-container">
          <img
            src="./src/assets/bhu.jpg"
            alt="RideInBls Logo"
            className="brand-logo"
          />
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="register-right">
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="login-title">Login to your account</h2>
          
          {/* Toggle between Email and Mobile */}
          <div className="login-method-toggle">
            <div className="login-method-toggle-wrapper">
              <button
                type="button"
                className={`toggle-btn ${loginMethod === "email" ? "active" : ""}`}
                onClick={() => setLoginMethod("email")}
                title="Login with Email"
              >
                <Mail size={26} />
              </button>
              <span className="toggle-label">Email</span>
            </div>
            
            <div className="login-method-toggle-wrapper">
              <button
                type="button"
                className={`toggle-btn ${loginMethod === "mobile" ? "active" : ""}`}
                onClick={() => setLoginMethod("mobile")}
                title="Login with Mobile"
              >
                <Smartphone size={26} />
              </button>
              <span className="toggle-label">Mobile</span>
            </div>
          </div>

          {/* Conditional Input Field */}
          {loginMethod === "email" ? (
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          ) : (
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
              className="login-input"
            />
          )}

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
            Don't have an account?{" "}
            <span className="link-text" onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </form>
      </div>

      {/* OTP Modal */}
      <OtpModal
        email={loginMethod === "email" ? email : mobile}
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