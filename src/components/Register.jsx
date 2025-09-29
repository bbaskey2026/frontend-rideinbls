import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import OtpModal from "../components/OtpModal"; // 👈 create OTP modal component
import "./Register.css";

function Register() {
  const { register, verifyRegistrationOtp } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1: Register and send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      setShowOtpModal(true); // 👈 open modal instead of step 2 form
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
        <img
          src="/images/register-side.png"
          alt="BLS Ride"
          className="register-image"
        />
        <h1 className="welcome-title">Welcome to RideInBls.com</h1>
        <p className="welcome-text">
          Discover a smarter way to travel with RideInBls.com. From daily
          commutes to weekend getaways, we bring you reliable vehicles,
          affordable pricing, and a seamless booking experience.  
          Join today and ride with comfort, safety, and convenience.
        </p>
      </div>

      {/* Right Side: Register Form */}
      <div className="register-right">
        <form onSubmit={handleRegister} className="login-form">
          <h2 className="login-title">Create Account</h2>
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
