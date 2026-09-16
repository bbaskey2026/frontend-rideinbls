import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Divider,
  Pagination,
} from "@mui/material";
import {
  Car,
  Calendar,
  MapPin,
  Copy,
  Check,
  XCircle,
  Plus,
  RefreshCw,
  Clock,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthContext from "../../../context/AuthContext";
import API_ENDPOINTS from "../../../config/api";
import StatusBadge from "../../../components/common/StatusBadge";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import PageHeader from "../../../components/common/PageHeader";
import BrandLoader from "../../../components/common/BrandLoader";

export default function Dashboard() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState(null);
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null, loading: false });

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_ENDPOINTS.VEHICLES.MY_BOOKINGS}?page=${page}&limit=6`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      if (res.ok) {
        setBookings(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token, page]);

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleConfirmCancel = async () => {
    if (!cancelModal.booking) return;
    setCancelModal((prev) => ({ ...prev, loading: true }));
    try {
      const b = cancelModal.booking;
      const cancelUrl = b._id
        ? API_ENDPOINTS.BOOKINGS.CANCEL(b._id)
        : API_ENDPOINTS.PAYMENTS.CANCEL_BY_VEHICLE;

      const res = await fetch(cancelUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: b._id,
          vehicleId: b.vehicle?._id || b.vehicleId || b.vehicle,
          reason: "Customer requested cancellation via Dashboard",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Booking cancelled. Refund initiated.");
        fetchBookings();
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      toast.error("Network error while cancelling ride");
    } finally {
      setCancelModal({ open: false, booking: null, loading: false });
    }
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => {
          const status = (b.bookingStatus || b.status || b.paymentStatus || "").toLowerCase();
          if (filter === "confirmed") {
            return ["confirmed", "active", "pending", "paid"].includes(status);
          }
          if (filter === "cancelled") {
            return ["cancelled", "refunded", "partially refunded"].includes(status);
          }
          return status === filter.toLowerCase();
        });

  if (authLoading) {
    return <BrandLoader message="Loading dashboard..." fullScreen />;
  }

  return (
    <Box sx={{ bgcolor: "#000000", minHeight: "100vh", pb: 10 }}>
      <PageHeader
        title={`Welcome back, ${user?.name || "Rider"}`}
        subtitle="Manage your current itineraries, ride history, and digital invoices"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Dashboard", path: "/dashboard" },
        ]}
        action={
          <Button
            variant="contained"
            onClick={() => navigate("/find-route")}
            startIcon={<Plus size={16} />}
            sx={{ bgcolor: "#ffffff", color: "#000", fontWeight: 700 }}
          >
            Book New Ride
          </Button>
        }
      />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, mx: "auto" }}>
        {/* Quick Stats Grid */}
        <Grid container spacing={2.5} sx={{ mb: 4, justifyContent: "center" }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#0a0a0a",
                background: "linear-gradient(145deg, #121212 0%, #080808 100%)",
                border: "1px solid #1f1f1f",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "border-color 0.2s ease, transform 0.2s ease",
                "&:hover": { borderColor: "#333", transform: "translateY(-2px)" },
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: "#71717a", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                  Total Rides Booked
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", mt: 0.5 }}>
                  {bookings.length}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2, color: "#ffffff" }}>
                <Car size={24} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#0a0a0a",
                background: "linear-gradient(145deg, #121212 0%, #080808 100%)",
                border: "1px solid #1f1f1f",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "border-color 0.2s ease, transform 0.2s ease",
                "&:hover": { borderColor: "#333", transform: "translateY(-2px)" },
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: "#71717a", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                  Active / Scheduled
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#10b981", mt: 0.5 }}>
                  {bookings.filter((b) => ["confirmed", "pending", "active", "paid"].includes((b.bookingStatus || b.status || "").toLowerCase())).length}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: "rgba(16,185,129,0.1)", borderRadius: 2, color: "#10b981" }}>
                <Clock size={24} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#0a0a0a",
                background: "linear-gradient(145deg, #121212 0%, #080808 100%)",
                border: "1px solid #1f1f1f",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "border-color 0.2s ease, transform 0.2s ease",
                "&:hover": { borderColor: "#333", transform: "translateY(-2px)" },
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: "#71717a", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                  Account Status
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", mt: 0.5 }}>
                  Verified
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: "rgba(56,189,248,0.1)", borderRadius: 2, color: "#38bdf8" }}>
                <Shield size={24} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Centered Filter Tabs & Action Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            mb: 4,
            pb: 2,
            borderBottom: "1px solid #18181b",
          }}
        >
          <Tabs
            value={filter}
            onChange={(_, val) => setFilter(val)}
            centered
            sx={{
              bgcolor: "#0d0d0d",
              border: "1px solid #222222",
              borderRadius: 3,
              p: 0.5,
              minHeight: 44,
              boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab
              value="all"
              label={`All Rides (${bookings.length})`}
              sx={{
                minHeight: 34,
                borderRadius: 2.5,
                px: 2.5,
                fontSize: "0.85rem",
                color: "#71717a",
                transition: "all 0.2s ease",
                "&.Mui-selected": { bgcolor: "#222", color: "#fff", fontWeight: 700 },
              }}
            />
            <Tab
              value="confirmed"
              label="Active / Confirmed"
              sx={{
                minHeight: 34,
                borderRadius: 2.5,
                px: 2.5,
                fontSize: "0.85rem",
                color: "#71717a",
                transition: "all 0.2s ease",
                "&.Mui-selected": { bgcolor: "#222", color: "#fff", fontWeight: 700 },
              }}
            />
            <Tab
              value="cancelled"
              label="Cancelled"
              sx={{
                minHeight: 34,
                borderRadius: 2.5,
                px: 2.5,
                fontSize: "0.85rem",
                color: "#71717a",
                transition: "all 0.2s ease",
                "&.Mui-selected": { bgcolor: "#222", color: "#fff", fontWeight: 700 },
              }}
            />
          </Tabs>

          <Tooltip title="Refresh Bookings">
            <IconButton
              size="small"
              onClick={fetchBookings}
              sx={{
                position: { sm: "absolute" },
                right: { sm: 0 },
                ml: { xs: 2, sm: 0 },
                color: "#71717a",
                bgcolor: "#0d0d0d",
                border: "1px solid #222",
                p: 1.2,
                borderRadius: 2.5,
                transition: "all 0.2s ease",
                "&:hover": { color: "#ffffff", bgcolor: "#1f1f1f", borderColor: "#444" },
              }}
            >
              <RefreshCw size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Bookings List */}
        {loading ? (
          <BrandLoader message="Fetching bookings..." />
        ) : filteredBookings.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: "center", bgcolor: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 3, maxWidth: 600, mx: "auto", my: 4 }}>
            <Car size={36} color="#52525b" style={{ marginBottom: 12 }} />
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
              No bookings found
            </Typography>
            <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5, mb: 3 }}>
              You haven't scheduled any rides matching this criteria.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/find-route")} sx={{ bgcolor: "#ffffff", color: "#000", fontWeight: 600 }}>
              Book Your First Ride
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            {filteredBookings.map((b) => (
              <Grid item xs={12} md={6} key={b._id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "#0a0a0a",
                    background: "linear-gradient(145deg, #111111 0%, #070707 100%)",
                    border: "1px solid #1f1f1f",
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "border-color 0.2s ease, transform 0.2s ease",
                    "&:hover": { borderColor: "#3f3f46", transform: "translateY(-2px)" },
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                          {b.vehicle?.name || "Executive Ride"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                          <Typography variant="caption" sx={{ color: "#71717a", fontFamily: "monospace" }}>
                            {b.bookingCode || b._id?.slice(-8)}
                          </Typography>
                          <Tooltip title={copiedCode === (b.bookingCode || b._id) ? "Copied!" : "Copy Code"}>
                            <IconButton
                              size="small"
                              onClick={() => copyCode(b.bookingCode || b._id)}
                              sx={{ p: 0.25, color: "#71717a", "&:hover": { color: "#fff" } }}
                            >
                              {copiedCode === (b.bookingCode || b._id) ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <StatusBadge status={b.bookingStatus || b.status || "Confirmed"} />
                    </Box>

                    <Divider sx={{ borderColor: "#18181b", my: 2 }} />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        <MapPin size={16} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: "#d4d4d8" }}>
                          <span style={{ color: "#71717a" }}>From: </span>{b.origin}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        <MapPin size={16} color="#f43f5e" style={{ marginTop: 2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: "#d4d4d8" }}>
                          <span style={{ color: "#71717a" }}>To: </span>{b.destination}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        <Calendar size={16} color="#38bdf8" style={{ marginTop: 2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: "#a1a1aa" }}>
                          {b.startDate ? new Date(b.startDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Scheduled"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, borderTop: "1px solid #18181b" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff" }}>
                      ₹{b.totalPrice || 0}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      {["confirmed", "pending", "active", "paid"].includes((b.bookingStatus || b.status || "").toLowerCase()) && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => setCancelModal({ open: true, booking: b, loading: false })}
                          sx={{ borderColor: "#3f1a24", color: "#fb7185", "&:hover": { borderColor: "#f43f5e", bgcolor: "transparent" } }}
                        >
                          Cancel Ride
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate("/booking-confirmation", { state: { booking: b } })}
                        sx={{ borderColor: "#27272a", color: "#ededed", "&:hover": { borderColor: "#555" } }}
                      >
                        View Receipt
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              sx={{
                "& .MuiPaginationItem-root": { color: "#888888" },
                "& .Mui-selected": { bgcolor: "#ffffff !important", color: "#000000 !important", fontWeight: 700 },
              }}
            />
          </Box>
        )}
      </Container>

      {/* Cancel Ride Modal */}
      <ConfirmationModal
        open={cancelModal.open}
        title="Cancel Ride Booking"
        description="Are you sure you want to cancel this booking? If cancelled 2+ hours in advance, 100% full refund will be credited back to your payment method."
        confirmText="Yes, Cancel Booking"
        danger={true}
        loading={cancelModal.loading}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelModal({ open: false, booking: null, loading: false })}
      />
    </Box>
  );
}
