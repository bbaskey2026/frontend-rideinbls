import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Link,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Mail, Smartphone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthContext from "../../../context/AuthContext";
import OtpModal from "./OtpModal";
import FormikMuiField from "../../../components/common/FormikMuiField";
import { loginSchema } from "../schemas/authValidation";
import API_ENDPOINTS from "../../../config/api";
import logo from "../../../assets/logo.png";

export default function Login() {
  const { login, verifyLoginOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "mobile"
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");

      const result = await login(values.identifier, values.password, loginMethod);

      if (result.success) {
        setShowOtpModal(true);
      } else {
        setErrorMessage(result.message || "Login failed. Please verify credentials.");
      }
      setLoading(false);
    },
  });

  const handleVerifyOtp = async () => {
    setLoading(true);
    setOtpMessage("");

    const result = await verifyLoginOtp(formik.values.identifier, otp, loginMethod);

    if (result.success) {
      setShowOtpModal(false);
      const destination = result.role === "admin" ? "/admin/vehicles" : (location.state?.from?.pathname || "/dashboard");
      navigate(destination, { replace: true });
    } else {
      setOtpMessage(result.message || "Invalid OTP. Try again.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpMessage("");
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.RESEND_OTP, {
        [loginMethod]: formik.values.identifier,
      });
      if (response.data.success) {
        setOtpMessage("New OTP sent! Check your inbox.");
      } else {
        setOtpMessage(response.data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setOtpMessage(err.response?.data?.message || "Server error while resending OTP.");
    }
    setResendLoading(false);
  };

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
        backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)",
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            component="img"
            src={logo}
            alt="RideInBls"
            sx={{
              height: 48,
              width: "auto",
              objectFit: "contain",
              mb: 2,
              filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.15))",
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: "#888888", mt: 0.5 }}>
            Sign in to access your bookings and manage rides
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            bgcolor: "#0a0a0a",
            border: "1px solid #222222",
            borderRadius: 3,
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)",
          }}
        >
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2.5, bgcolor: "#180a0e", border: "1px solid #3f1a24" }}>
              {errorMessage}
            </Alert>
          )}

          {/* Toggle between Email & Mobile */}
          <Tabs
            value={loginMethod}
            onChange={(_, val) => {
              setLoginMethod(val);
              formik.setFieldValue("identifier", "");
            }}
            variant="fullWidth"
            sx={{
              mb: 3,
              bgcolor: "#111111",
              borderRadius: 2,
              p: 0.5,
              minHeight: 40,
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab
              value="email"
              icon={<Mail size={16} />}
              iconPosition="start"
              label="Email"
              sx={{
                borderRadius: 1.5,
                minHeight: 36,
                fontSize: "0.8125rem",
                "&.Mui-selected": { bgcolor: "#222222", color: "#ffffff" },
              }}
            />
            <Tab
              value="mobile"
              icon={<Smartphone size={16} />}
              iconPosition="start"
              label="Mobile"
              sx={{
                borderRadius: 1.5,
                minHeight: 36,
                fontSize: "0.8125rem",
                "&.Mui-selected": { bgcolor: "#222222", color: "#ffffff" },
              }}
            />
          </Tabs>

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <FormikMuiField
                formik={formik}
                name="identifier"
                label={loginMethod === "email" ? "Email Address" : "10-Digit Mobile Number"}
                placeholder={loginMethod === "email" ? "name@example.com" : "9876543210"}
                type={loginMethod === "email" ? "email" : "tel"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loginMethod === "email" ? <Mail size={18} color="#71717a" /> : <Smartphone size={18} color="#71717a" />}
                    </InputAdornment>
                  ),
                }}
              />

              <FormikMuiField
                formik={formik}
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  underline="hover"
                  sx={{ color: "#888888", fontSize: "0.8125rem", "&:hover": { color: "#ffffff" } }}
                >
                  Forgot Password?
                </Link>
              </Box>

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
                  fontSize: "0.9375rem",
                  "&:hover": { bgcolor: "#eaeaea" },
                }}
              >
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#71717a" }}>
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                sx={{ color: "#ffffff", fontWeight: 600 }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* OTP Modal */}
      <OtpModal
        email={formik.values.identifier}
        isOpen={showOtpModal}
        otp={otp}
        setOtp={setOtp}
        loading={loading}
        message={otpMessage}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        resendLoading={resendLoading}
      />
    </Box>
  );
}
