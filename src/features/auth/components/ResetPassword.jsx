import React, { useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Link,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Lock, KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import FormikMuiField from "../../../components/common/FormikMuiField";
import { resetPasswordSchema } from "../schemas/authValidation";
import API_ENDPOINTS from "../../../config/api";
import logo from "../../../assets/logo.png";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const response = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        });

        if (response.data.success) {
          setSuccessMessage("Password updated successfully! Redirecting to login...");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setErrorMessage(response.data.message || "Failed to reset password.");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Server error while resetting password.");
      }
      setLoading(false);
    },
  });

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 68px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        bgcolor: "#000000",
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box component="img" src={logo} alt="RideInBls" sx={{ height: 44, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
            Set New Password
          </Typography>
          <Typography variant="body2" sx={{ color: "#888888", mt: 0.5 }}>
            Verification code sent to <strong style={{ color: "#fff" }}>{email || "your email"}</strong>
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            bgcolor: "#0a0a0a",
            border: "1px solid #222222",
            borderRadius: 3,
          }}
        >
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2.5, bgcolor: "#180a0e", border: "1px solid #3f1a24" }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2.5, bgcolor: "#0a180e", border: "1px solid #1a3f24" }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <FormikMuiField
                formik={formik}
                name="otp"
                label="6-Digit OTP"
                placeholder="000000"
                inputProps={{ maxLength: 6 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyRound size={18} color="#71717a" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormikMuiField
                formik={formik}
                name="newPassword"
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#71717a" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#71717a" }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormikMuiField
                formik={formik}
                name="confirmPassword"
                label="Confirm New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Repeat new password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#71717a" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<CheckCircle2 size={18} />}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#000000",
                  py: 1.25,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#eaeaea" },
                }}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{ color: "#888888", fontSize: "0.875rem", "&:hover": { color: "#ffffff" } }}
            >
              Cancel & Return to Login
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
