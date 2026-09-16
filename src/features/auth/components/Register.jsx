import React, { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
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
  Grid,
} from "@mui/material";
import { User, Mail, Smartphone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthContext from "../../../context/AuthContext";
import OtpModal from "./OtpModal";
import FormikMuiField from "../../../components/common/FormikMuiField";
import { registerSchema } from "../schemas/authValidation";
import logo from "../../../assets/logo.png";

export default function Register() {
  const { register, verifyRegistrationOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");

      const result = await register(values.name, values.email, values.mobile, values.password);

      if (result.success) {
        setShowOtpModal(true);
      } else {
        setErrorMessage(result.message || "Registration failed. Please check your information.");
      }
      setLoading(false);
    },
  });

  const handleVerifyOtp = async () => {
    setLoading(true);
    setOtpMessage("");

    const result = await verifyRegistrationOtp(formik.values.email, otp);

    if (result.success) {
      setShowOtpModal(false);
      const destination = result.role === "admin" ? "/admin/vehicles" : "/";
      navigate(destination, { replace: true });
    } else {
      setOtpMessage(result.message || "Invalid OTP code.");
    }
    setLoading(false);
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
      <Container maxWidth="sm">
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
            Create Your Account
          </Typography>
          <Typography variant="body2" sx={{ color: "#888888", mt: 0.5 }}>
            Join RideInBls for transparent fares, real-time booking, and luxury rides
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: "#0a0a0a",
            border: "1px solid #222222",
            borderRadius: 3,
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)",
          }}
        >
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: "#180a0e", border: "1px solid #3f1a24" }}>
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <FormikMuiField
                  formik={formik}
                  name="name"
                  label="Full Name"
                  placeholder="e.g. Bhimsen Baskey"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} color="#71717a" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormikMuiField
                  formik={formik}
                  name="email"
                  label="Email Address"
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormikMuiField
                  formik={formik}
                  name="mobile"
                  label="Mobile Number"
                  type="tel"
                  placeholder="9876543210"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Smartphone size={18} color="#71717a" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormikMuiField
                  formik={formik}
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormikMuiField
                  formik={formik}
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat password"
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: "#71717a" }}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
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
                    py: 1.35,
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    mt: 1,
                    "&:hover": { bgcolor: "#eaeaea" },
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account & Verify OTP"}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#71717a" }}>
              Already registered?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ color: "#ffffff", fontWeight: 600 }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* OTP Modal */}
      <OtpModal
        email={formik.values.email}
        isOpen={showOtpModal}
        otp={otp}
        setOtp={setOtp}
        loading={loading}
        message={otpMessage}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
      />
    </Box>
  );
}
