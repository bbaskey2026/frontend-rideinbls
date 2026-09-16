import React from "react";
import { Chip } from "@mui/material";

export default function StatusBadge({ status, size = "small" }) {
  const normalized = (status || "").toLowerCase();

  let bgcolor = "rgba(255, 255, 255, 0.06)";
  let color = "#a1a1aa";
  let borderColor = "#27272a";

  if (["confirmed", "completed", "active", "available", "success", "paid"].includes(normalized)) {
    bgcolor = "rgba(16, 185, 129, 0.1)";
    color = "#34d399";
    borderColor = "rgba(16, 185, 129, 0.25)";
  } else if (["pending", "processing", "in-progress", "waiting"].includes(normalized)) {
    bgcolor = "rgba(245, 158, 11, 0.1)";
    color = "#fbbf24";
    borderColor = "rgba(245, 158, 11, 0.25)";
  } else if (["cancelled", "failed", "blocked", "unavailable", "rejected"].includes(normalized)) {
    bgcolor = "rgba(244, 63, 94, 0.1)";
    color = "#fb7185";
    borderColor = "rgba(244, 63, 94, 0.25)";
  }

  return (
    <Chip
      size={size}
      label={status || "Unknown"}
      sx={{
        bgcolor,
        color,
        borderColor,
        fontWeight: 600,
        fontSize: "0.75rem",
        textTransform: "capitalize",
        height: size === "small" ? 24 : 28,
        letterSpacing: "0.02em",
      }}
    />
  );
}
