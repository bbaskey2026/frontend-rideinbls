import React, { useState } from "react";
import { Box, Container, Typography, Grid, Paper, Chip, Button } from "@mui/material";
import { MapPin, Navigation, Sparkles } from "lucide-react";
import ServiceExpansionRequest from "./ServiceExpansionRequest";

const CITIES = [
  {
    name: "Balasore",
    state: "Odisha",
    description: "Central operational hub with 24/7 round-the-clock vehicle dispatch and airport drops.",
    status: "Active 24/7",
    popularRoutes: ["Balasore → Bhubaneswar", "Balasore → Kolkata", "Balasore → Cuttack"],
  },
  {
    name: "Bhubaneswar",
    state: "Odisha",
    description: "Capital corridor coverage, express airport transfers, and premier corporate rides.",
    status: "Active 24/7",
    popularRoutes: ["Bhubaneswar → Puri", "Bhubaneswar → Balasore", "Bhubaneswar → Rourkela"],
  },
  {
    name: "Cuttack",
    state: "Odisha",
    description: "Silver City point-to-point transfers and outstation holiday travel packages.",
    status: "Active",
    popularRoutes: ["Cuttack → Bhubaneswar", "Cuttack → Paradip", "Cuttack → Balasore"],
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    description: "Interstate high-speed luxury highway transfers and terminal connections.",
    status: "Interstate Route",
    popularRoutes: ["Kolkata → Balasore", "Kolkata → Digha", "Kolkata → Baripada"],
  },
  {
    name: "Puri",
    state: "Odisha",
    description: "Pilgrim tours, coastal scenic drives, and multi-day holiday rental fleets.",
    status: "Active",
    popularRoutes: ["Puri → Bhubaneswar", "Puri → Konark", "Puri → Chilika"],
  },
  {
    name: "Rourkela",
    state: "Odisha",
    description: "Industrial district connectivity and premium long-haul chauffeur services.",
    status: "Scheduled",
    popularRoutes: ["Rourkela → Sambalpur", "Rourkela → Bhubaneswar"],
  },
];

export default function Cities() {
  const [openExpansion, setOpenExpansion] = useState(false);

  return (
    <Box id="cities" sx={{ py: 10, bgcolor: "#000000", borderTop: "1px solid #1f1f1f" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "flex-end" }, mb: 6, gap: 2 }}>
          <Box>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.5, bgcolor: "#111", border: "1px solid #222", borderRadius: 5, mb: 1.5 }}>
              <MapPin size={14} color="#ffffff" />
              <Typography variant="caption" sx={{ color: "#a1a1aa", fontWeight: 600 }}>
                Coverage Map
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
              Service Network
            </Typography>
            <Typography variant="body1" sx={{ color: "#888888", mt: 1, maxWidth: 600 }}>
              Connecting major economic hubs, airports, and cultural centers across Odisha and Eastern India with guaranteed zero-cancellation rides.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={() => setOpenExpansion(true)}
            startIcon={<Sparkles size={16} />}
            sx={{
              borderColor: "#27272a",
              color: "#ededed",
              "&:hover": { borderColor: "#ffffff", bgcolor: "transparent" },
            }}
          >
            Request Your City
          </Button>
        </Box>

        <Grid container spacing={3}>
          {CITIES.map((city, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: "#0a0a0a",
                  border: "1px solid #1f1f1f",
                  borderRadius: 3,
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": {
                    borderColor: "#3f3f46",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
                        {city.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#71717a" }}>
                        {city.state}
                      </Typography>
                    </Box>
                    <Chip
                      label={city.status}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.06)",
                        color: "#d4d4d8",
                        border: "1px solid #27272a",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: "#a1a1aa", mb: 3, lineHeight: 1.6 }}>
                    {city.description}
                  </Typography>
                </Box>

                <Box sx={{ pt: 2, borderTop: "1px solid #18181b" }}>
                  <Typography variant="caption" sx={{ color: "#71717a", fontWeight: 700, textTransform: "uppercase", display: "block", mb: 1 }}>
                    Frequent Routes
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    {city.popularRoutes.map((route, rIdx) => (
                      <Box key={rIdx} sx={{ display: "flex", alignItems: "center", gap: 1, color: "#888888", fontSize: "0.8125rem" }}>
                        <Navigation size={12} color="#52525b" />
                        <span>{route}</span>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Expansion Request Dialog */}
      <ServiceExpansionRequest open={openExpansion} onClose={() => setOpenExpansion(false)} />
    </Box>
  );
}
