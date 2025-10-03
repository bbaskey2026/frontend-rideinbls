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
    <div className="otp-modal-overlay">
      <div className="otp-modal-content">
        <div className="otp-modal-header">
          <h2>Email Verification</h2>
        </div>

        <div className="otp-modal-body">
          <p className="otp-info-text">
            We've sent a One-Time Password (OTP) to <strong>{email}</strong>.
            Please enter it below to verify your account.
          </p>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="otp-input-field"
            maxLength="6"
          />

          {message && <p className="otp-message-text">{message}</p>}

          <div className="otp-modal-actions">
            <button onClick={onClose} className="otp-cancel-btn">
              Cancel
            </button>
            <button 
              onClick={onVerify} 
              disabled={loading} 
              className="otp-verify-btn"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>

          <p className="otp-form-footer">
            Didn't receive OTP?{" "}
            <span
              className="otp-resend-link"
              onClick={resendLoading ? null : onResend}
              style={{ 
                cursor: resendLoading ? "not-allowed" : "pointer",
                opacity: resendLoading ? 0.5 : 1
              }}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;