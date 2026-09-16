import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Divider,
} from "@mui/material";
import {
  MapPin,
  Car,
  Users,
  Fuel,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Luggage,
} from "lucide-react";
import AuthContext from "../../../context/AuthContext";
import API_ENDPOINTS from "../../../config/api";
import BrandLoader from "../../../components/common/BrandLoader";
import PageHeader from "../../../components/common/PageHeader";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStates, setBookingStates] = useState({});
  const [vehiclePrices, setVehiclePrices] = useState({});

  const { token, user } = useContext(AuthContext);
  const query = new URLSearchParams(useLocation().search);
  const source = query.get("source");
  const destination = query.get("destination");
  const navigate = useNavigate();

  const getBookingState = (id) =>
    bookingStates[id] || { isRoundTrip: false, startAt: "", endAt: "" };

  const calculatePrice = (vehicle, state) => {
    const { isRoundTrip, startAt, endAt } = state || {};

    const ratePerKm = Number(vehicle.pricePerKM || vehicle.pricePerKm || vehicle.price || 13);
    const ratePerHour = Number(vehicle.pricePerHour || 170);
    const baseFare = Number(vehicle.baseFare || 0);

    // Distance calculation
    const distKm = Number(
      distance?.distanceValue ||
      (distance?.distance?.value ? Math.round(distance.distance.value / 1000) : 85)
    );
    const effectiveDistance = isRoundTrip ? distKm * 2 : distKm;
    const distanceFare = Math.round(effectiveDistance * ratePerKm);

    // Duration calculation
    let durationFare = 0;
    if (startAt && endAt) {
      const start = new Date(startAt);
      const end = new Date(endAt);
      if (!isNaN(start) && !isNaN(end) && end > start) {
        const totalHours = Math.max(1, (end - start) / (1000 * 60 * 60));
        durationFare = Math.round(totalHours * ratePerHour);
      }
    } else if (distance?.durationValue) {
      const estHours = Math.max(1, Math.round(distance.durationValue / 3600));
      durationFare = Math.round(estHours * (ratePerHour * 0.5));
    }

    const subtotal = Math.max(baseFare, baseFare + distanceFare + durationFare);
    const gstAmount = Math.round((subtotal * 5) / 100);
    const totalPrice = subtotal + gstAmount;

    return {
      total: totalPrice,
      distanceFare,
      durationFare,
      subtotal,
      gstAmount,
      ratePerKm,
      ratePerHour,
      effectiveDistance,
    };
  };

  const updateBookingState = (vehicleId, updates) => {
    setBookingStates((prev) => {
      const newState = { ...prev, [vehicleId]: { ...getBookingState(vehicleId), ...updates } };
      const vehicle = vehicles.find((v) => v._id === vehicleId);
      if (vehicle) {
        const newPrice = calculatePrice(vehicle, newState[vehicleId]);
        setVehiclePrices((prevP) => ({ ...prevP, [vehicleId]: newPrice }));
      }
      return newState;
    });
  };

  useEffect(() => {
    const fetchVehiclesAndDistance = async () => {
      if (!source || !destination) {
        navigate("/find-route");
        return;
      }

      setLoading(true);
      try {
        // 1. Distance Calculation
        let distData = { distanceText: "Approx 85 km", durationText: "1h 45m", distanceValue: 85 };
        try {
          const distRes = await axios.post(API_ENDPOINTS.GOOGLE.DISTANCE, { source, destination });
          if (distRes.data) {
            distData = distRes.data;
          }
        } catch (e) {
          console.warn("Distance calculation fallback used:", e);
        }
        setDistance(distData);

        // 2. Fetch available vehicles (backend and client filtered for not-booked & available)
        const vehRes = await axios.get(API_ENDPOINTS.VEHICLES.BASE);
        const rawList = vehRes.data?.data || vehRes.data?.vehicles || (Array.isArray(vehRes.data) ? vehRes.data : []);
        const list = rawList.filter((v) => v.isAvailable !== false && !v.isBooked && v.isBooked !== "true");
        setVehicles(list);

        // Compute initial prices
        const initialPrices = {};
        list.forEach((v) => {
          initialPrices[v._id] = calculatePrice(v, { isRoundTrip: false });
        });
        setVehiclePrices(initialPrices);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        toast.error("Failed to load vehicle options. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehiclesAndDistance();
  }, [source, destination]);

  const handleBookNow = (vehicle) => {
    if (!token && !user) {
      toast.info("Please login to complete your booking.");
      navigate("/login", { state: { from: { pathname: "/finding-vehicles", search: `?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}` } } });
      return;
    }

    const state = getBookingState(vehicle._id);
    const calculatedPriceObj = vehiclePrices[vehicle._id] || calculatePrice(vehicle, state);
    const calculatedFinalPrice = typeof calculatedPriceObj === "object" ? calculatedPriceObj.total : calculatedPriceObj;

    navigate("/payment", {
      state: {
        vehicle,
        source,
        destination,
        distance,
        isRoundTrip: state.isRoundTrip,
        startAt: state.startAt || new Date().toISOString(),
        endAt: state.endAt || new Date(Date.now() + 86400000).toISOString(),
        totalPrice: calculatedFinalPrice,
        priceBreakdown: calculatedPriceObj,
      },
    });
  };

  if (loading) {
    return <BrandLoader message="Calculating optimal routes & checking live fleet..." fullScreen />;
  }

  return (
    <Box sx={{ bgcolor: "#000000", minHeight: "100vh", pb: 10 }}>
      <PageHeader
        title="Select Your Vehicle"
        subtitle={`Route: ${source} → ${destination}`}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Book Ride", path: "/find-route" },
          { label: "Select Vehicle", path: "#" },
        ]}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Route Summary Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "#0a0a0a",
            border: "1px solid #222222",
            borderRadius: 3,
            mb: 5,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: "#111", border: "1px solid #222", borderRadius: 2, color: "#fff" }}>
              <Navigation size={22} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "#71717a" }}>
                Total Highway Distance & Est. Time
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                {distance?.distanceText || distance?.distance || "Distance calculated"} • {distance?.durationText || distance?.duration || "Express route"}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/find-route")}
            sx={{ borderColor: "#2e2e2e", color: "#ededed", "&:hover": { borderColor: "#ffffff", bgcolor: "transparent" } }}
          >
            Change Route
          </Button>
        </Paper>

        {/* Vehicles Grid */}
        <Grid container spacing={3.5}>
          {vehicles.map((vehicle) => {
            const state = getBookingState(vehicle._id);
            const priceObj = vehiclePrices[vehicle._id] || calculatePrice(vehicle, state);
            const currentPrice = typeof priceObj === "object" ? priceObj.total : priceObj;
            const ratePerKm = priceObj?.ratePerKm ?? vehicle.pricePerKM ?? vehicle.pricePerKm ?? 13;
            const imageSrc =
              vehicle.images?.[0] ||
              (vehicle.image ? API_ENDPOINTS.VEHICLES.IMAGE(vehicle.image) : null) ||
              "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80";

            return (
              <Grid item xs={12} lg={6} key={vehicle._id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "#0a0a0a",
                    border: "1px solid #222222",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    transition: "all 0.2s ease",
                    "&:hover": { borderColor: "#3f3f46" },
                  }}
                >
                  <Box>
                    <Grid container spacing={2.5}>
                      {/* Left: Vehicle Image */}
                      <Grid item xs={12} sm={5}>
                        <Box
                          sx={{
                            position: "relative",
                            height: 180,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "#050505",
                            border: "1px solid #1c1c1e",
                          }}
                        >
                          <Box
                            component="img"
                            src={imageSrc}
                            alt={vehicle.name}
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80";
                            }}
                          />
                          <Chip
                            label={vehicle.category || "Sedan"}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              bgcolor: "rgba(0,0,0,0.8)",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "0.65rem",
                            }}
                          />
                        </Box>
                      </Grid>

                      {/* Right: Specs & Name */}
                      <Grid item xs={12} sm={7}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                          {vehicle.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#71717a", display: "block", mb: 2 }}>
                          {vehicle.brand || "Executive"} • AC Model
                        </Typography>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          <Chip
                            icon={<Users size={14} color="#a1a1aa" />}
                            label={`${vehicle.capacity || 4} Seats`}
                            size="small"
                            sx={{ bgcolor: "#111", color: "#ededed", border: "1px solid #222" }}
                          />
                          <Chip
                            icon={<Luggage size={14} color="#a1a1aa" />}
                            label={`${vehicle.luggageCapacity || 3} Bags`}
                            size="small"
                            sx={{ bgcolor: "#111", color: "#ededed", border: "1px solid #222" }}
                          />
                          <Chip
                            icon={<Fuel size={14} color="#a1a1aa" />}
                            label={vehicle.fuelType || "Petrol/CNG"}
                            size="small"
                            sx={{ bgcolor: "#111", color: "#ededed", border: "1px solid #222" }}
                          />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={state.isRoundTrip}
                                onChange={(e) => updateBookingState(vehicle._id, { isRoundTrip: e.target.checked })}
                                size="small"
                              />
                            }
                            label={<Typography variant="body2" sx={{ color: "#d4d4d8" }}>Round Trip Booking</Typography>}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Schedule Date Selection */}
                    <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #18181b" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Pickup Departure"
                            type="datetime-local"
                            value={state.startAt}
                            onChange={(e) => updateBookingState(vehicle._id, { startAt: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        {state.isRoundTrip && (
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Return Date & Time"
                              type="datetime-local"
                              value={state.endAt}
                              onChange={(e) => updateBookingState(vehicle._id, { endAt: e.target.value })}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Box>

                  {/* Pricing & Checkout Button */}
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2.5,
                      borderTop: "1px solid #1f1f1f",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: "#71717a", display: "block" }}>
                        All-Inclusive Total Fare (₹{ratePerKm}/km • 5% GST)
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
                        ₹{Number(currentPrice || 0).toLocaleString("en-IN")}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleBookNow(vehicle)}
                      endIcon={<ArrowRight size={18} />}
                      sx={{
                        bgcolor: "#ffffff",
                        color: "#000000",
                        fontWeight: 700,
                        px: 3,
                        py: 1.25,
                        "&:hover": { bgcolor: "#eaeaea" },
                      }}
                    >
                      Book Ride
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
