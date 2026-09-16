import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { X as CloseIcon, AlertTriangle } from "lucide-react";

export default function ConfirmationModal({
  open,
  title = "Confirm Action",
  description = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  loading = false,
  danger = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#0a0a0a",
          border: "1px solid #222222",
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, px: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {danger && (
            <Box
              sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: "rgba(244, 63, 94, 0.1)",
                color: "#f43f5e",
                display: "flex",
              }}
            >
              <AlertTriangle size={18} />
            </Box>
          )}
          <DialogTitle sx={{ p: 0, fontSize: "1.1rem", fontWeight: 600, color: "#ededed" }}>
            {title}
          </DialogTitle>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          disabled={loading}
          sx={{ color: "#71717a", "&:hover": { color: "#ffffff" } }}
        >
          <CloseIcon size={18} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        <DialogContentText sx={{ color: "#a1a1aa", fontSize: "0.875rem", lineHeight: 1.6 }}>
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            borderColor: "#27272a",
            color: "#a1a1aa",
            "&:hover": { borderColor: "#3f3f46", bgcolor: "transparent", color: "#ededed" },
          }}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            bgcolor: danger ? "#f43f5e" : "#ffffff",
            color: danger ? "#ffffff" : "#000000",
            "&:hover": {
              bgcolor: danger ? "#e11d48" : "#eaeaea",
            },
          }}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
