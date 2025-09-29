import React from "react";
import "./OtpModal.css";

const OtpModal = ({
  email,
  isOpen,
  otp,
  setOtp,
  loading,
  message,
  onClose,
  onVerify,
  onResend,
  resendLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Email Verification</h2>
        <p className="info-text">
          We’ve sent a One-Time Password (OTP) to <strong>{email}</strong>.
          Please enter it below to verify your account.
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="otp-input"
        />

        {message && <p className="info-text">{message}</p>}

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={onVerify} disabled={loading} className="verify-btn">
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        <p className="form-footer">
          Didn’t receive OTP?{" "}
          <span
            className="link-text"
            onClick={onResend}
            style={{ cursor: resendLoading ? "not-allowed" : "pointer" }}
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OtpModal;
