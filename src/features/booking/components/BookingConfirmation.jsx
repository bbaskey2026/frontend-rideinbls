import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { jsPDF } from "jspdf";
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
} from "@mui/material";
import {
  CheckCircle2,
  Download,
  Car,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (location.state?.booking) {
      setBooking(location.state.booking);
      localStorage.setItem("lastBooking", JSON.stringify(location.state.booking));
    } else {
      const saved = localStorage.getItem("lastBooking");
      if (saved) {
        setBooking(JSON.parse(saved));
      } else {
        const timer = setTimeout(() => navigate("/dashboard"), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [location.state, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "Immediate";
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "N/A";
    }
  };

  const downloadPDF = () => {
    if (!booking) return;
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setFont(undefined, "bold");
      doc.text("RideInBls - Digital Trip Receipt", 14, 22);

      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text("Official Booking Confirmation & Tax Invoice", 14, 30);
      doc.line(14, 34, 196, 34);

      const items = [
        { label: "Booking Reference:", value: booking.bookingCode || "BLS-TRIP" },
        { label: "Vehicle Model:", value: booking.vehicle ? `${booking.vehicle.name} (${booking.vehicle.brand || ""})` : "Executive Sedan" },
        { label: "Pickup Location:", value: booking.origin || "Origin Point" },
        { label: "Drop Destination:", value: booking.destination || "Destination Point" },
        { label: "Departure Date/Time:", value: formatDate(booking.startDate) },
        { label: "Trip Type:", value: booking.isRoundTrip ? "Round Trip" : "One-Way" },
        { label: "Total Paid:", value: `INR ${booking.totalPrice || 0}` },
        { label: "Payment Status:", value: booking.paymentStatus || "PAID" },
        { label: "Transaction Ref:", value: booking.payment?.providerPaymentId || "TXN-VERIFIED" },
        { label: "Passenger Name:", value: booking.user?.name || booking.user?.email || "Passenger" },
      ];

      let y = 46;
      items.forEach((item) => {
        doc.setFont(undefined, "bold");
        doc.text(item.label, 14, y);
        doc.setFont(undefined, "normal");
        doc.text(String(item.value), 75, y);
        y += 10;
      });

      doc.line(14, y + 4, 196, y + 4);
      doc.setFontSize(10);
      doc.setFont(undefined, "italic");
      doc.text("Thank you for choosing RideInBls. Chauffeur details dispatched 30 mins prior to trip.", 14, y + 14);
      doc.text("Helpline: +91 82495 92464 | Rideinbls@gmail.com", 14, y + 22);

      doc.save(`RideInBls_Receipt_${booking.bookingCode || "Booking"}.pdf`);
    } catch (e) {
      console.error("PDF download error:", e);
    }
  };

  if (!booking) {
    return (
      <Box sx={{ bgcolor: "#000000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body1" sx={{ color: "#888888" }}>
          No active booking session found. Redirecting to dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#000000", minHeight: "100vh", pb: 10 }}>
      <PageHeader
        title="Booking Confirmed!"
        subtitle="Your trip has been successfully scheduled and assigned to our active fleet"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Confirmation", path: "#" },
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
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
          }}
        >
          {/* Success Banner */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: "50%",
                display: "flex",
              }}
            >
              <CheckCircle2 size={32} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
                Ride Confirmed
              </Typography>
              <Typography variant="body2" sx={{ color: "#a1a1aa" }}>
                Booking ID: <strong style={{ color: "#fff", fontFamily: "monospace" }}>{booking.bookingCode || "CONFIRMED"}</strong>
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#18181b", mb: 4 }} />

          {/* Receipt Details Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#050505", border: "1px solid #1c1c1e", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: "#71717a", textTransform: "uppercase", fontWeight: 700 }}>
                  Assigned Vehicle
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff", mt: 0.5 }}>
                  {booking.vehicle?.name || "Executive Fleet"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#a1a1aa" }}>
                  {booking.vehicle?.brand || "Luxury"} • {booking.vehicle?.category || "Sedan"}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#050505", border: "1px solid #1c1c1e", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: "#71717a", textTransform: "uppercase", fontWeight: 700 }}>
                  Payment Status
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#10b981" }}>
                    ₹{booking.totalPrice || 0}
                  </Typography>
                  <Chip label="PAID" size="small" sx={{ bgcolor: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 700 }} />
                </Box>
                <Typography variant="caption" sx={{ color: "#71717a" }}>
                  Txn: {booking.payment?.providerPaymentId || "VERIFIED"}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#050505", border: "1px solid #1c1c1e", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: "#71717a", textTransform: "uppercase", fontWeight: 700, display: "block", mb: 2 }}>
                  Trip Itinerary
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <MapPin size={18} color="#10b981" style={{ marginTop: 2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "#71717a" }}>Pickup</Typography>
                      <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>{booking.origin}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <MapPin size={18} color="#f43f5e" style={{ marginTop: 2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "#71717a" }}>Dropoff</Typography>
                      <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>{booking.destination}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Calendar size={18} color="#38bdf8" style={{ marginTop: 2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "#71717a" }}>Departure Schedule</Typography>
                      <Typography variant="body2" sx={{ color: "#ededed", fontWeight: 600 }}>
                        {formatDate(booking.startDate)} {booking.isRoundTrip && " (Round Trip)"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Actions */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={downloadPDF}
              startIcon={<Download size={18} />}
              sx={{
                bgcolor: "#ffffff",
                color: "#000000",
                fontWeight: 700,
                py: 1.25,
                flex: 1,
                "&:hover": { bgcolor: "#eaeaea" },
              }}
            >
              Download PDF Invoice
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/dashboard")}
              endIcon={<ArrowRight size={18} />}
              sx={{
                borderColor: "#2e2e2e",
                color: "#ededed",
                flex: 1,
                "&:hover": { borderColor: "#ffffff", bgcolor: "transparent" },
              }}
            >
              Go to Dashboard
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
