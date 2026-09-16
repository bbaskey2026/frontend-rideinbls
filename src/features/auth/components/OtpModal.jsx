import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import { X as CloseIcon, ShieldCheck, RefreshCw } from "lucide-react";

export default function OtpModal({
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
}) {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = null;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleResendClick = async () => {
    if (onResend && timer === 0 && !resendLoading) {
      await onResend();
      setTimer(60);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0a0a0a",
          border: "1px solid #222222",
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, px: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1.5,
              bgcolor: "rgba(255,255,255,0.06)",
              display: "flex",
              color: "#ffffff",
            }}
          >
            <ShieldCheck size={20} />
          </Box>
          <DialogTitle sx={{ p: 0, fontSize: "1.1rem", fontWeight: 700, color: "#ededed" }}>
            Verification Required
          </DialogTitle>
        </Box>
        <IconButton size="small" onClick={onClose} disabled={loading} sx={{ color: "#71717a" }}>
          <CloseIcon size={18} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        <Typography variant="body2" sx={{ color: "#a1a1aa", mb: 2.5, lineHeight: 1.5 }}>
          We've sent a 6-digit One-Time Password to <strong style={{ color: "#fff" }}>{email}</strong>.
        </Typography>

        <TextField
          fullWidth
          autoFocus
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputProps={{
            maxLength: 6,
            style: {
              textAlign: "center",
              letterSpacing: "0.5em",
              fontSize: "1.5rem",
              fontWeight: 700,
              fontFamily: "monospace",
            },
          }}
          sx={{ mb: 2 }}
        />

        {message && (
          <Alert severity={message.toLowerCase().includes("sent") || message.toLowerCase().includes("success") ? "success" : "error"} sx={{ mb: 2, bgcolor: "#111", border: "1px solid #222" }}>
            {message}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          <Typography variant="caption" sx={{ color: "#71717a" }}>
            Didn't get code?
          </Typography>
          <Button
            size="small"
            variant="text"
            disabled={timer > 0 || resendLoading}
            onClick={handleResendClick}
            startIcon={<RefreshCw size={12} className={resendLoading ? "animate-spin" : ""} />}
            sx={{
              fontSize: "0.75rem",
              color: timer > 0 ? "#52525b" : "#ffffff",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            {timer > 0 ? `Resend in ${timer}s` : resendLoading ? "Sending..." : "Resend OTP"}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{ borderColor: "#27272a", color: "#a1a1aa" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onVerify}
          disabled={loading || otp.length < 4}
          sx={{ bgcolor: "#ffffff", color: "#000", fontWeight: 600 }}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
