import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import {
  MapPin,
  Calendar,
  Car,
  CheckCircle,
  Shield,
  Clock,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingPage from "../../booking/components/BookingPage";
import Cities from "./Cities";
import Reviews from "./Reviews";
import Partner from "./Partner";
import Policies from "./Policies";
import ContactSection from "./ContactSection";

import heroImage from "../../../assets/hero.png";
import locationImage from "../../../assets/location1.png";
import timeImage from "../../../assets/time-date.png";
import vehicleImage from "../../../assets/pickavehicle.png";
import confirmImage from "../../../assets/confirm.png";

const TRUST_STATS = [
  { value: "50,000+", label: "Completed Trips", icon: <Car size={18} /> },
  { value: "4.9 / 5.0", label: "Rider Rating", icon: <Star size={18} fill="#f59e0b" color="#f59e0b" /> },
  { value: "0%", label: "Cancellation Penalty", icon: <Shield size={18} /> },
  { value: "100%", label: "Verified Chauffeurs", icon: <CheckCircle size={18} /> },
];

const STEPS = [
  {
    step: "01",
    title: "Choose Location",
    description: "Select your pickup point and destination. Live GPS calculation estimates the shortest highway path.",
    image: locationImage,
    icon: <MapPin size={22} color="#ffffff" />,
  },
  {
    step: "02",
    title: "Select Schedule",
    description: "Choose departure time. Book immediately or schedule for later with precise notifications.",
    image: timeImage,
    icon: <Calendar size={22} color="#ffffff" />,
  },
  {
    step: "03",
    title: "Pick Your Fleet",
    description: "Select from our lineup: comfortable sedans, rugged 7-seater SUVs, or executive luxury cruisers.",
    image: vehicleImage,
    icon: <Car size={22} color="#ffffff" />,
  },
  {
    step: "04",
    title: "Confirm & Go",
    description: "Review fare details and confirm instantly with UPI, cards, or digital wallets.",
    image: confirmImage,
    icon: <CheckCircle size={22} color="#ffffff" />,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#000000", color: "#ededed", overflow: "hidden" }}>
      {/* Uber Style Hero Section */}
      <Box
        sx={{
          pt: { xs: 4, md: 8 },
          pb: { xs: 8, md: 12 },
          bgcolor: "#000000",
          borderBottom: "1px solid #1a1a1a",
          position: "relative",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={{ xs: 4, lg: 8 }} alignItems="center">
            {/* Left Column: Headline & Uber Booking Card */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.04em",
                    fontSize: { xs: "2.5rem", sm: "3.25rem", md: "3.75rem" },
                    lineHeight: 1.08,
                    mb: 1.5,
                  }}
                >
                  Go anywhere with RideInBls
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#888888",
                    fontSize: "1.125rem",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Request a ride, hop in, and go. Transparent fixed pricing across Odisha.
                </Typography>
              </Box>

              {/* Uber Interactive Booking Widget */}
              <BookingPage isHero={true} />
            </Grid>

            {/* Right Column: Uber Style Fleet Showcase Illustration Card */}
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    bgcolor: "#ffffff",
                    borderRadius: 5,
                    width: "100%",
                    boxShadow: "0 30px 70px rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.8)",
                    border: "1px solid #eaeaea",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Fleet Illustration */}
                  <Box
                    component="img"
                    src={heroImage}
                    alt="RideInBls Premium Fleet"
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: { xs: 300, sm: 420 },
                      objectFit: "contain",
                      display: "block",
                      mx: "auto",
                      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  />

                  {/* Bottom Strip */}
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid #f0f0f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#000000" }}>
                        Luxury, Sedan & SUV Lineup
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666666" }}>
                        24/7 Verified Chauffeur Service
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate("/fleet-catalog")}
                      endIcon={<ArrowRight size={14} />}
                      sx={{
                        bgcolor: "#000000",
                        color: "#ffffff",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 2,
                        "&:hover": { bgcolor: "#222222" },
                      }}
                    >
                      View Fleet
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {/* Trust Metrics Grid */}
          <Grid container spacing={3} sx={{ mt: { xs: 4, md: 6 } }}>
            {TRUST_STATS.map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "#0a0a0a",
                    border: "1px solid #1f1f1f",
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ p: 1.25, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2, color: "#fff", display: "flex" }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How to Book Section */}
      <Box id="how-to-book" sx={{ py: 12, bgcolor: "#050505", borderBottom: "1px solid #1f1f1f" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.5, bgcolor: "#111", border: "1px solid #222", borderRadius: 5, mb: 1.5 }}>
              <Clock size={14} color="#ffffff" />
              <Typography variant="caption" sx={{ color: "#a1a1aa", fontWeight: 600 }}>
                Simple 4-Step Process
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
              How to Book in 60 Seconds
            </Typography>
            <Typography variant="body1" sx={{ color: "#888888", mt: 1, maxWidth: 540, mx: "auto" }}>
              Engineered for zero friction. Book your ride, choose your car, and hit the road effortlessly.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {STEPS.map((step, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    bgcolor: "#0a0a0a",
                    border: "1px solid #1f1f1f",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#3f3f46",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                      <Box sx={{ p: 1.25, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2, color: "#fff", display: "flex" }}>
                        {step.icon}
                      </Box>
                      <Typography variant="h6" sx={{ color: "#3f3f46", fontWeight: 800 }}>
                        {step.step}
                      </Typography>
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#ffffff", mb: 1.5, letterSpacing: "-0.02em" }}>
                      {step.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#888888", lineHeight: 1.6, mb: 3 }}>
                      {step.description}
                    </Typography>
                  </Box>

                  <Box
                    component="img"
                    src={step.image}
                    alt={step.title}
                    sx={{
                      width: "100%",
                      height: 140,
                      objectFit: "contain",
                      bgcolor: "#050505",
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid #18181b",
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Service Cities Coverage */}
      <Cities />

      {/* Verified Reviews */}
      <Reviews />

      {/* Driver Partner CTA */}
      <Partner />

      {/* Policies & FAQ */}
      <Policies />

      {/* Contact Support */}
      <ContactSection />
    </Box>
  );
}
