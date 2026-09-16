import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function BrandLoader({ message = "Loading...", fullScreen = false }) {
  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2.5,
        p: 4,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={52}
          thickness={2.5}
          sx={{
            color: "#ffffff",
            animationDuration: "850ms",
          }}
        />
        <Box
          component="img"
          src="/src/assets/logo.png"
          alt="rideinbls"
          sx={{
            position: "absolute",
            width: 22,
            height: 22,
            objectFit: "contain",
            filter: "brightness(1.5)",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "#888888",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          fontWeight: 600,
        }}
      >
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
      {content}
    </Box>
  );
}
