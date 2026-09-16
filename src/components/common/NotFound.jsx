import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { Compass, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "#000000",
        minHeight: "calc(100vh - 68px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 8,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            bgcolor: "#0a0a0a",
            border: "1px solid #222222",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "rgba(255,255,255,0.05)",
              color: "#ffffff",
              borderRadius: "50%",
              display: "inline-flex",
              mb: 2,
            }}
          >
            <Compass size={36} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
            404
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#ededed", mt: 0.5 }}>
            Route Not Found
          </Typography>
          <Typography variant="body2" sx={{ color: "#71717a", mt: 1, mb: 3 }}>
            The destination you're trying to reach does not exist or has been relocated.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/")}
            startIcon={<ArrowLeft size={16} />}
            sx={{ bgcolor: "#ffffff", color: "#000", fontWeight: 700, py: 1.25 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
