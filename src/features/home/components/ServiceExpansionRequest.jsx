import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  Grid,
} from "@mui/material";
import { X as CloseIcon, Sparkles, Send } from "lucide-react";
import { useFormik } from "formik";
import FormikMuiField from "../../../components/common/FormikMuiField";
import { serviceExpansionSchema } from "../../booking/schemas/bookingValidation";

export default function ServiceExpansionRequest({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      route: "",
      notes: "",
    },
    validationSchema: serviceExpansionSchema,
    onSubmit: async (values, { resetForm }) => {
      // Send or simulate expansion request
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      resetForm();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0a0a0a",
          border: "1px solid #222222",
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, px: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1.5,
              bgcolor: "rgba(255,255,255,0.06)",
              display: "flex",
              color: "#ffffff",
            }}
          >
            <Sparkles size={18} />
          </Box>
          <DialogTitle sx={{ p: 0, fontSize: "1.1rem", fontWeight: 700, color: "#ededed" }}>
            Request New City or Route
          </DialogTitle>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#71717a" }}>
          <CloseIcon size={18} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        <Typography variant="body2" sx={{ color: "#888888", mb: 3 }}>
          Looking for rides in a city not listed yet? Tell us where you need us to launch next.
        </Typography>

        {submitted ? (
          <Alert severity="success" sx={{ bgcolor: "#0a180e", border: "1px solid #1a3f24", my: 2 }}>
            Thank you! Your route request has been submitted to our expansion operations team.
          </Alert>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormikMuiField formik={formik} name="name" label="Your Name" placeholder="Bhimsen" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikMuiField formik={formik} name="phone" label="Mobile Number" placeholder="9876543210" />
              </Grid>
              <Grid item xs={12}>
                <FormikMuiField formik={formik} name="email" label="Email Address" placeholder="name@example.com" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikMuiField formik={formik} name="city" label="City / Region" placeholder="e.g. Sambalpur" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikMuiField formik={formik} name="route" label="Target Route" placeholder="e.g. Sambalpur → Jharsuguda" />
              </Grid>
              <Grid item xs={12}>
                <FormikMuiField
                  formik={formik}
                  name="notes"
                  label="Additional Details (Optional)"
                  placeholder="Expected frequency, vehicle preference..."
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            <DialogActions sx={{ px: 0, pt: 3, pb: 1, gap: 1 }}>
              <Button variant="outlined" onClick={onClose} sx={{ borderColor: "#27272a", color: "#a1a1aa" }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
                endIcon={<Send size={16} />}
                sx={{ bgcolor: "#ffffff", color: "#000", fontWeight: 600 }}
              >
                {formik.isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
