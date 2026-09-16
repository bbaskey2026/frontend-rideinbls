import React from "react";
import { Box, Container, Typography, Grid, Paper, Button, Stack } from "@mui/material";
import { Car, DollarSign, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Partner() {
  const navigate = useNavigate();

  return (
    <Box id="partner" sx={{ py: 10, bgcolor: "#000000", borderTop: "1px solid #1f1f1f" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            bgcolor: "#080808",
            border: "1px solid #222222",
            borderRadius: 4,
            backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)",
          }}
        >
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.5, bgcolor: "#141414", border: "1px solid #27272a", borderRadius: 5, mb: 2 }}>
                <Car size={14} color="#ffffff" />
                <Typography variant="caption" sx={{ color: "#a1a1aa", fontWeight: 600 }}>
                  Driver & Fleet Partner Program
                </Typography>
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", mb: 2 }}>
                Drive & Earn With Guaranteed Daily Payouts
              </Typography>

              <Typography variant="body1" sx={{ color: "#888888", mb: 4, lineHeight: 1.7, maxWidth: 580 }}>
                Join Odisha's fastest growing premium fleet network. Get flexible outstation trips, zero commission gouging, real-time trip assignment, and weekly bonus incentives.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/driver-signup")}
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
                  Onboard As Driver
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/fleet-catalog")}
                  sx={{
                    borderColor: "#2e2e2e",
                    color: "#ededed",
                    px: 3,
                    "&:hover": { borderColor: "#ffffff", bgcolor: "transparent" },
                  }}
                >
                  Browse Active Fleet
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "#0e0e0e",
                    border: "1px solid #1f1f1f",
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2, color: "#fff" }}>
                    <DollarSign size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff" }}>
                      Transparent Fare Splits
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      Keep maximum earnings with zero hidden service deductions.
                    </Typography>
                  </Box>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "#0e0e0e",
                    border: "1px solid #1f1f1f",
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2, color: "#fff" }}>
                    <Calendar size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff" }}>
                      Flexible Duty Scheduling
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      Choose your routes, outstation packages, or local airport shifts.
                    </Typography>
                  </Box>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "#0e0e0e",
                    border: "1px solid #1f1f1f",
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2, color: "#fff" }}>
                    <ShieldCheck size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff" }}>
                      Complete Driver Insurance
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      Full coverage on all dispatched highway and interstate journeys.
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
