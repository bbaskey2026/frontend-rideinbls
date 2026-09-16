import React from "react";
import { Box, Container, Typography, Grid, Paper, Rating, Avatar } from "@mui/material";
import { Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rohan Mohapatra",
    role: "Business Traveler",
    route: "Balasore ⇄ Bhubaneswar Airport",
    rating: 5,
    comment: "The cleanest vehicle and most punctual chauffeur service in Odisha. The fixed pricing with zero hidden charges makes it effortless for corporate travel.",
    verified: true,
  },
  {
    name: "Priyanka Dash",
    role: "Family Holiday Traveler",
    route: "Bhubaneswar ⇄ Puri Beach Resort",
    rating: 5,
    comment: "Booking was done in literally 60 seconds. AC was pristine, the driver was courteous, and having instant digital receipts made everything seamless.",
    verified: true,
  },
  {
    name: "Amitav Sahoo",
    role: "Regular Commuter",
    route: "Balasore ⇄ Kolkata Highway",
    rating: 5,
    comment: "Hands down the best inter-city outstation cab service. Real-time driver updates and transparent payment methods give absolute peace of mind.",
    verified: true,
  },
];

export default function Reviews() {
  return (
    <Box id="reviews" sx={{ py: 10, bgcolor: "#050505", borderTop: "1px solid #1f1f1f" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.5, bgcolor: "#111", border: "1px solid #222", borderRadius: 5, mb: 1.5 }}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <Typography variant="caption" sx={{ color: "#a1a1aa", fontWeight: 600 }}>
              Verified Passenger Feedback
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
            Rated 4.9/5 by 12,000+ Riders
          </Typography>
          <Typography variant="body1" sx={{ color: "#888888", mt: 1, maxWidth: 550, mx: "auto" }}>
            Real reviews from business professionals, families, and everyday travelers across our network.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {TESTIMONIALS.map((review, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
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
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Rating value={review.rating} readOnly size="small" sx={{ color: "#ffffff" }} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#10b981", fontSize: "0.75rem", fontWeight: 600 }}>
                      <CheckCircle2 size={14} />
                      <span>Verified Ride</span>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ color: "#d4d4d8", fontStyle: "italic", mb: 3, lineHeight: 1.6 }}>
                    "{review.comment}"
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 2, borderTop: "1px solid #18181b" }}>
                  <Avatar sx={{ bgcolor: "#ffffff", color: "#000000", fontWeight: 700, width: 38, height: 38 }}>
                    {review.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff" }}>
                      {review.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a", display: "block" }}>
                      {review.role} • {review.route}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
