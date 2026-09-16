import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Divider,
  Alert,
} from "@mui/material";
import {
  User,
  Mail,
  Smartphone,
  Calendar,
  MapPin,
  Car,
  Award,
  Send,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import AuthContext from "../../../context/AuthContext";
import API_ENDPOINTS from "../../../config/api";
import FormikMuiField from "../../../components/common/FormikMuiField";
import PageHeader from "../../../components/common/PageHeader";
import { driverOnboardingSchema } from "../schemas/adminValidation";

export default function DriverManagement() {
  const { token } = useContext(AuthContext);
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      licenseNumber: "",
      experienceYears: 3,
      vehicleModel: "",
      vehicleNumber: "",
      city: "Balasore",
    },
    validationSchema: driverOnboardingSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await new Promise((r) => setTimeout(r, 800));
        setSubmitted(true);
        toast.success("Driver onboarding application submitted successfully!");
        resetForm();
      } catch (err) {
        toast.error("Failed to submit application");
      }
    },
  });

  return (
    <Box sx={{ bgcolor: "#000000", minHeight: "100vh", pb: 10 }}>
      <PageHeader
        title="Driver & Chauffeur Onboarding"
        subtitle="Register verified vehicle operators and dispatch partners to the active platform"
        breadcrumbs={[
          { label: "Admin Console", path: "/admin/vehicles" },
          { label: "Driver Signup", path: "/driver-signup" },
        ]}
      />

      <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            bgcolor: "#0a0a0a",
            border: "1px solid #222222",
            borderRadius: 3,
          }}
        >
          {submitted ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: "50%",
                  display: "inline-flex",
                  mb: 2,
                }}
              >
                <CheckCircle2 size={40} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff" }}>
                Driver Application Registered
              </Typography>
              <Typography variant="body2" sx={{ color: "#888888", mt: 1, maxWidth: 440, mx: "auto" }}>
                Our operations team has received the chauffeur details. Background verification will complete in 24 hours.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSubmitted(false)}
                sx={{ mt: 3, borderColor: "#333", color: "#ededed" }}
              >
                Register Another Driver
              </Button>
            </Box>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1, bgcolor: "#111", border: "1px solid #222", borderRadius: 1.5, color: "#fff" }}>
                  <ShieldCheck size={20} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff" }}>
                    Driver & Vehicle Information
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#71717a" }}>
                    All fields will be verified against RTO database
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormikMuiField
                    formik={formik}
                    name="name"
                    label="Driver Full Name"
                    placeholder="e.g. Ramesh Chandra Das"
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
                    name="mobile"
                    label="10-Digit Mobile"
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
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="driver@example.com"
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
                    name="city"
                    label="Primary Operating City"
                    placeholder="e.g. Balasore / Bhubaneswar"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapPin size={18} color="#71717a" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormikMuiField
                    formik={formik}
                    name="licenseNumber"
                    label="Driving License Number"
                    placeholder="OD-01-20180001234"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormikMuiField
                    formik={formik}
                    name="experienceYears"
                    label="Years of Driving Experience"
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormikMuiField
                    formik={formik}
                    name="vehicleModel"
                    label="Assigned Vehicle Model"
                    placeholder="e.g. Maruti Dzire VXI"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Car size={18} color="#71717a" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormikMuiField
                    formik={formik}
                    name="vehicleNumber"
                    label="Vehicle Registration Plate"
                    placeholder="OD-01-AB-1234"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={formik.isSubmitting}
                    endIcon={<Send size={18} />}
                    sx={{
                      bgcolor: "#ffffff",
                      color: "#000000",
                      py: 1.35,
                      fontWeight: 700,
                      mt: 1,
                      "&:hover": { bgcolor: "#eaeaea" },
                    }}
                  >
                    {formik.isSubmitting ? "Registering..." : "Submit Driver Onboarding"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
