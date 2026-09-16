import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import {
  Car,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import AuthContext from "../../../context/AuthContext";
import API_ENDPOINTS from "../../../config/api";
import PageHeader from "../../../components/common/PageHeader";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const { vehicle, source, destination, distance, isRoundTrip, startAt, endAt, totalPrice: propPrice, price } =
    state || {};
  const finalPrice = propPrice || price || 0;

  useEffect(() => {
    if (!vehicle) {
      toast.error("Booking parameters missing. Please select a vehicle first.");
      navigate("/find-route");
    }
  }, [vehicle, navigate]);

  const handlePayment = async () => {
    if (!vehicle) return;

    setLoading(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Payment SDK gateway failed to initialize. Please check internet connection.");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        vehicleId: vehicle._id,
        amount: finalPrice,
        origin: source,
        destination,
        isRoundTrip: Boolean(isRoundTrip),
        startDate: startAt || new Date().toISOString(),
        endDate: endAt || new Date(Date.now() + 86400000).toISOString(),
      };

      const { data } = await axios.post(
        API_ENDPOINTS.PAYMENTS.CREATE_ORDER,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: data.data.key,
        amount: data.data.amount,
        currency: data.data.currency || "INR",
        name: "RideInBls",
        description: `${vehicle.name} Luxury Ride Booking`,
        order_id: data.data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              API_ENDPOINTS.PAYMENTS.VERIFY,
              {
                ...response,
                vehicleId: vehicle._id,
                amount: finalPrice,
                origin: source,
                destination,
                isRoundTrip: Boolean(isRoundTrip),
                startDate: startAt || new Date().toISOString(),
                endDate: endAt || null,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (verifyRes.data.success) {
              toast.success("Payment verified! Booking confirmed.");
              navigate("/booking-confirmation", {
                state: { booking: verifyRes.data.data?.booking },
              });
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error(`Verification error: ${err.message}`);
          }
        },
        prefill: {
          name: user?.name || "Passenger",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        theme: { color: "#000000" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment order error:", err);
      toast.error(err.response?.data?.message || `Payment error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Box sx={{ bgcolor: "#000000", minHeight: "100vh", pb: 10 }}>
      <PageHeader
        title="Review & Confirm Booking"
        subtitle="Complete payment to guarantee vehicle dispatch and chauffeur assignment"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Vehicles", path: "/finding-vehicles" },
          { label: "Checkout", path: "#" },
        ]}
      />

      <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Left / Main Summary Card */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                bgcolor: "#0a0a0a",
                border: "1px solid #222222",
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1, bgcolor: "#111", border: "1px solid #222", borderRadius: 1.5, color: "#fff" }}>
                  <Car size={20} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                    {vehicle.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#71717a" }}>
                    {vehicle.brand || "Executive"} • {vehicle.category || "Sedan"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "#18181b", mb: 3 }} />

              {/* Itinerary Details */}
              <Stack spacing={2.5}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <MapPin size={18} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>Pickup Point</Typography>
                    <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>{source}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <MapPin size={18} color="#f43f5e" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>Dropoff Destination</Typography>
                    <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>{destination}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Calendar size={18} color="#38bdf8" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>Trip Schedule</Typography>
                    <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>
                      {startAt ? new Date(startAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Immediate Dispatch"}
                      {isRoundTrip && " (Round Trip)"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Box sx={{ mt: 4, p: 2, bgcolor: "#050505", border: "1px solid #1c1c1e", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#10b981" }}>
                  <ShieldCheck size={18} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    100% Refund Guarantee on cancellations made 2 hours before trip.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Price Breakdown & Checkout */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                bgcolor: "#0a0a0a",
                border: "1px solid #222222",
                borderRadius: 3,
                position: "sticky",
                top: 90,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff", mb: 2 }}>
                Fare Breakdown
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "#888888" }}>Base Fare & Mileage</Typography>
                  <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>
                    ₹{Math.round(finalPrice * 0.85)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "#888888" }}>Chauffeur Allowance</Typography>
                  <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>
                    ₹{Math.round(finalPrice * 0.1)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "#888888" }}>GST & Highway Tolls</Typography>
                  <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>
                    ₹{Math.round(finalPrice * 0.05)}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#1f1f1f", my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#ffffff" }}>
                    Total Payable
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                onClick={handlePayment}
                startIcon={<Lock size={16} />}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#000000",
                  py: 1.35,
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  mb: 2,
                  "&:hover": { bgcolor: "#eaeaea" },
                }}
              >
                {loading ? "Initializing..." : "Pay Securely with UPI / Card"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "#52525b" }}>
                  Secured by 256-Bit SSL Encrypted Razorpay Gateway
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
