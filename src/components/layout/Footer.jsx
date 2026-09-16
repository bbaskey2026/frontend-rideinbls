import React from "react";
import { Box, Container, Grid, Typography, Link, Divider, Stack } from "@mui/material";
import { MapPin, Phone, Mail, ShieldCheck, Zap, Globe } from "lucide-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
  const navigate = useNavigate();

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000000",
        borderTop: "1px solid #1f1f1f",
        color: "#888888",
        pt: 8,
        pb: 5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={5}>
          {/* Brand & Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                component="img"
                src={logo}
                alt="rideinbls"
                sx={{ height: 32, width: "auto", objectFit: "contain" }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
                RideInBls
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#71717a", mb: 3, maxWidth: 360, lineHeight: 1.7 }}>
              Odisha's premier on-demand and scheduled luxury vehicle fleet. Engineered for maximum reliability, speed, and passenger safety.
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#a1a1aa", fontSize: "0.875rem" }}>
                <MapPin size={16} color="#71717a" />
                <span>Balasore, Odisha, India</span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#a1a1aa", fontSize: "0.875rem" }}>
                <Phone size={16} color="#71717a" />
                <span>+91 82495 92464</span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#a1a1aa", fontSize: "0.875rem" }}>
                <Mail size={16} color="#71717a" />
                <span>Rideinbls@gmail.com</span>
              </Box>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff", mb: 2.5, letterSpacing: "-0.01em" }}>
              Explore
            </Typography>
            <Stack spacing={1.5}>
              <Link component={RouterLink} to="/fleet-catalog" underline="hover" sx={{ color: "#888888", fontSize: "0.875rem", "&:hover": { color: "#ffffff" } }}>
                Fleet Catalog
              </Link>
              <Link component={RouterLink} to="/find-route" underline="hover" sx={{ color: "#888888", fontSize: "0.875rem", "&:hover": { color: "#ffffff" } }}>
                Book a Ride
              </Link>
              <Link onClick={() => handleScrollTo("cities")} sx={{ color: "#888888", fontSize: "0.875rem", cursor: "pointer", "&:hover": { color: "#ffffff" } }}>
                Service Cities
              </Link>
              <Link onClick={() => handleScrollTo("reviews")} sx={{ color: "#888888", fontSize: "0.875rem", cursor: "pointer", "&:hover": { color: "#ffffff" } }}>
                Passenger Reviews
              </Link>
            </Stack>
          </Grid>

          {/* Support & Drivers */}
          <Grid item xs={6} sm={3} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff", mb: 2.5, letterSpacing: "-0.01em" }}>
              Partners & Drivers
            </Typography>
            <Stack spacing={1.5}>
              <Link onClick={() => handleScrollTo("partner")} sx={{ color: "#888888", fontSize: "0.875rem", cursor: "pointer", "&:hover": { color: "#ffffff" } }}>
                Drive with Us
              </Link>
              <Link onClick={() => handleScrollTo("expansion")} sx={{ color: "#888888", fontSize: "0.875rem", cursor: "pointer", "&:hover": { color: "#ffffff" } }}>
                Request New Route
              </Link>
              <Link onClick={() => handleScrollTo("contact")} sx={{ color: "#888888", fontSize: "0.875rem", cursor: "pointer", "&:hover": { color: "#ffffff" } }}>
                Support & Inquiries
              </Link>
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff", mb: 2.5, letterSpacing: "-0.01em" }}>
              Trust & Transparency
            </Typography>
            <Stack spacing={1.5}>
              <Link onClick={() => handleScrollTo("policies")} sx={{ color: "#888888", fontSize: "0.875rem", cursor: "pointer", "&:hover": { color: "#ffffff" } }}>
                Terms & Conditions
              </Link>
              <Link onClick={() => handleScrollTo("policies")} sx={{ color: "#888888", fontSize: "0.875rem", cursor: "pointer", "&:hover": { color: "#ffffff" } }}>
                Cancellation & Refund Policy
              </Link>
              <Link onClick={() => handleScrollTo("policies")} sx={{ color: "#888888", fontSize: "0.875rem", cursor: "pointer", "&:hover": { color: "#ffffff" } }}>
                Privacy Policy
              </Link>
            </Stack>

            <Box
              sx={{
                mt: 3,
                p: 1.5,
                bgcolor: "#09090b",
                border: "1px solid #1f1f1f",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <ShieldCheck size={20} color="#10b981" />
              <Typography variant="caption" sx={{ color: "#a1a1aa", lineHeight: 1.4 }}>
                100% Verified Drivers & Secure Instant Online Payments
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#18181b", my: 5 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "#52525b" }}>
            © {new Date().getFullYear()} RideInBls Inc. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography variant="caption" sx={{ color: "#52525b", display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
              All Systems Operational
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
