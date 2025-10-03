import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import OtpModal from "../components/OtpModal";
import "./Register.css";

function Register() {
  const { register, verifyRegistrationOtp } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1: Register and send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, mobile, password);
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
    const result = await verifyRegistrationOtp(email, otp);

    if (result.success) {
      setShowOtpModal(false);
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      {/* Left Side: Image + Text */}
      <div className="register-left">
        <h1 className="welcome-title">Welcome Back to RideInBls.com</h1>
        {/* Replace welcome title & text with brand logo */}
        <div className="brand-logo-container">
          <img
            src="./src/assets/bhu.jpg"
            alt="RideInBls Logo"
            className="brand-logo"
          />
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="register-right">
        <form onSubmit={handleRegister} className="login-form">
          <h2 className="login-title">What's your email?</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit mobile number"
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Sending OTP..." : "Register"}
          </button>

          <p className="form-footer">
            Already have an account?{" "}
            <span className="link-text" onClick={() => navigate("/login")}>
              Login
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
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
      />
    </div>
  );
}

export default Register;