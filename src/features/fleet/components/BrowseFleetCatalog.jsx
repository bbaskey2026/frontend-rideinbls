import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Tabs,
  Tab,
  Rating,
  CircularProgress,
} from "@mui/material";
import { Users, Fuel, Car, Shield, Luggage, ArrowRight, Sparkles, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../../../config/api";
import PageHeader from "../../../components/common/PageHeader";

const CATEGORIES = ["All", "Sedan", "SUV", "Luxury", "Hatchback", "Traveller"];

export default function BrowseFleetCatalog({ vehicles: propVehicles, onBook }) {
  const [vehicles, setVehicles] = useState(propVehicles || []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(!propVehicles);
  const navigate = useNavigate();

  useEffect(() => {
    if (!propVehicles) {
      const fetchFleet = async () => {
        setLoading(true);
        try {
          const res = await axios.get(API_ENDPOINTS.VEHICLES.BASE);
          const data = res.data?.data || res.data?.vehicles || (Array.isArray(res.data) ? res.data : []);
          setVehicles(data);
        } catch (err) {
          console.error("Fleet fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchFleet();
    }
  }, [propVehicles]);

  const filteredVehicles =
    activeCategory === "All"
      ? vehicles
      : vehicles.filter(
          (v) =>
            (v.category || v.type || "").toLowerCase() === activeCategory.toLowerCase()
        );

  const handleBookVehicle = (vehicle) => {
    if (onBook) {
      onBook(vehicle);
    } else {
      navigate(`/find-route?vehicleId=${vehicle._id || ""}`);
    }
  };

  return (
    <Box sx={{ bgcolor: "#000000", minHeight: "100vh", pb: 10 }}>
      <PageHeader
        title="Fleet Showcase"
        subtitle="Explore verified luxury sedans, family SUVs, and outstation executive cruisers"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Fleet Catalog", path: "/fleet-catalog" },
        ]}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Category Filter Pills */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: { xs: "flex-start", sm: "center" }, overflowX: "auto", pb: 1 }}>
          <Tabs
            value={activeCategory}
            onChange={(_, val) => setActiveCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: "#0a0a0a",
              border: "1px solid #222222",
              borderRadius: 3,
              p: 0.5,
              minHeight: 44,
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            {CATEGORIES.map((cat) => (
              <Tab
                key={cat}
                value={cat}
                label={cat}
                sx={{
                  borderRadius: 2,
                  minHeight: 36,
                  px: 2.5,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#71717a",
                  "&.Mui-selected": { bgcolor: "#ffffff", color: "#000000" },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress size={40} sx={{ color: "#ffffff" }} />
          </Box>
        ) : filteredVehicles.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              bgcolor: "#0a0a0a",
              border: "1px solid #1f1f1f",
              borderRadius: 3,
            }}
          >
            <Car size={40} color="#52525b" style={{ marginBottom: 12 }} />
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
              No vehicles found in this category
            </Typography>
            <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
              Try selecting another vehicle type or reset filters.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3.5}>
            {filteredVehicles.map((vehicle) => {
              const imageSrc =
                vehicle.images?.[0] ||
                (vehicle.image ? API_ENDPOINTS.VEHICLES.IMAGE(vehicle.image) : null) ||
                "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80";

              return (
                <Grid item xs={12} sm={6} lg={4} key={vehicle._id || vehicle.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#0a0a0a",
                      border: "1px solid #1f1f1f",
                      borderRadius: 3,
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": {
                        borderColor: "#3f3f46",
                        transform: "translateY(-3px)",
                        boxShadow: "0 16px 36px -10px rgba(0,0,0,0.8)",
                      },
                    }}
                  >
                    <Box>
                      {/* Vehicle Image Container */}
                      <Box
                        sx={{
                          position: "relative",
                          height: 210,
                          bgcolor: "#050505",
                          borderBottom: "1px solid #18181b",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src={imageSrc}
                          alt={vehicle.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "scale(1.05)" },
                          }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80";
                          }}
                        />
                        <Chip
                          label={vehicle.category || vehicle.type || "Sedan"}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            bgcolor: "rgba(0,0,0,0.75)",
                            backdropFilter: "blur(8px)",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            border: "1px solid rgba(255,255,255,0.15)",
                          }}
                        />
                      </Box>

                      {/* Content */}
                      <Box sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                              {vehicle.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#71717a" }}>
                              {vehicle.brand || "Executive"} • {vehicle.modelYear || "2024"}
                            </Typography>
                          </Box>
                          <Rating value={vehicle.rating || 4.9} precision={0.1} readOnly size="small" sx={{ color: "#ffffff" }} />
                        </Box>

                        {/* Specs Pills Grid */}
                        <Grid container spacing={1} sx={{ mt: 1.5, mb: 2.5 }}>
                          <Grid item xs={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, bgcolor: "#111", borderRadius: 1.5, border: "1px solid #1c1c1e" }}>
                              <Users size={15} color="#a1a1aa" />
                              <Typography variant="caption" sx={{ color: "#d4d4d8", fontWeight: 500 }}>
                                {vehicle.capacity || vehicle.seats || 4} Passengers
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, bgcolor: "#111", borderRadius: 1.5, border: "1px solid #1c1c1e" }}>
                              <Luggage size={15} color="#a1a1aa" />
                              <Typography variant="caption" sx={{ color: "#d4d4d8", fontWeight: 500 }}>
                                {vehicle.luggageCapacity || 3} Bags
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, bgcolor: "#111", borderRadius: 1.5, border: "1px solid #1c1c1e" }}>
                              <Fuel size={15} color="#a1a1aa" />
                              <Typography variant="caption" sx={{ color: "#d4d4d8", fontWeight: 500 }}>
                                {vehicle.fuelType || "Petrol/CNG"}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, bgcolor: "#111", borderRadius: 1.5, border: "1px solid #1c1c1e" }}>
                              <Shield size={15} color="#a1a1aa" />
                              <Typography variant="caption" sx={{ color: "#d4d4d8", fontWeight: 500 }}>
                                AC Included
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>

                    {/* Bottom Pricing & CTA */}
                    <Box sx={{ px: 3, pb: 3, pt: 2, borderTop: "1px solid #18181b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#71717a", display: "block" }}>
                          Rate per km
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff" }}>
                          ₹{vehicle.pricePerKm || vehicle.price || 14}
                          <span style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 400 }}> / km</span>
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        onClick={() => handleBookVehicle(vehicle)}
                        endIcon={<ArrowRight size={16} />}
                        sx={{
                          bgcolor: "#ffffff",
                          color: "#000000",
                          fontWeight: 700,
                          px: 2.5,
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
        )}
      </Container>
    </Box>
  );
}
