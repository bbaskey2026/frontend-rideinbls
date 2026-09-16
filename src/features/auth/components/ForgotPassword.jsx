import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
  InputAdornment,
} from "@mui/material";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import FormikMuiField from "../../../components/common/FormikMuiField";
import { forgotPasswordSchema } from "../schemas/authValidation";
import API_ENDPOINTS from "../../../config/api";
import logo from "../../../assets/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const response = await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email: values.email });
        if (response.data.success) {
          setSuccessMessage("OTP sent to your email. Redirecting...");
          setTimeout(() => {
            navigate(`/reset-password?email=${encodeURIComponent(values.email)}`);
          }, 1200);
        } else {
          setErrorMessage(response.data.message || "Failed to send OTP.");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Server error while requesting password reset.");
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
            Reset Password
          </Typography>
          <Typography variant="body2" sx={{ color: "#888888", mt: 0.5 }}>
            Enter your account email to receive a password reset OTP
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
                name="email"
                label="Registered Email"
                type="email"
                placeholder="name@example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} color="#71717a" />
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
                endIcon={<ArrowRight size={18} />}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#000000",
                  py: 1.25,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#eaeaea" },
                }}
              >
                {loading ? "Sending OTP..." : "Send Reset Code"}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{
                color: "#888888",
                fontSize: "0.875rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": { color: "#ffffff" },
              }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
