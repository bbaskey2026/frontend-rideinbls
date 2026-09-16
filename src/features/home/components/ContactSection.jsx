import React, { useState } from "react";
import { Box, Container, Typography, Grid, Paper, Button, Alert, Stack } from "@mui/material";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormikMuiField from "../../../components/common/FormikMuiField";

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Valid email required").required("Email is required"),
  message: Yup.string().min(10, "Minimum 10 characters").required("Message is required"),
});

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", message: "" },
    validationSchema: contactSchema,
    onSubmit: async (values, { resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitted(true);
      resetForm();
      setTimeout(() => setSubmitted(false), 3000);
    },
  });

  return (
    <Box id="contact" sx={{ py: 10, bgcolor: "#000000", borderTop: "1px solid #1f1f1f" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.5, bgcolor: "#111", border: "1px solid #222", borderRadius: 5, mb: 1.5 }}>
              <MessageSquare size={14} color="#ffffff" />
              <Typography variant="caption" sx={{ color: "#a1a1aa", fontWeight: 600 }}>
                Direct Support
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", mb: 2 }}>
              Get In Touch With Our Dispatch Team
            </Typography>

            <Typography variant="body1" sx={{ color: "#888888", mb: 4, lineHeight: 1.7 }}>
              Have custom tour requirements, corporate fleet queries, or emergency route requests? Our team is available 24/7.
            </Typography>

            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: "#0a0a0a", border: "1px solid #222", borderRadius: 2, color: "#fff" }}>
                  <Phone size={18} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#71717a" }}>Emergency Helpline</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#ededed" }}>+91 82495 92464</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: "#0a0a0a", border: "1px solid #222", borderRadius: 2, color: "#fff" }}>
                  <Mail size={18} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#71717a" }}>Support Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#ededed" }}>Rideinbls@gmail.com</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: "#0a0a0a", border: "1px solid #222", borderRadius: 2, color: "#fff" }}>
                  <MapPin size={18} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#71717a" }}>Headquarters</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#ededed" }}>Balasore, Odisha, India</Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: "#0a0a0a",
                border: "1px solid #222222",
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#ffffff", mb: 0.5 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mb: 3 }}>
                We typically respond within 15 minutes during operational hours.
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 3, bgcolor: "#0a180e", border: "1px solid #1a3f24" }}>
                  Message sent! Our support team will reach out shortly.
                </Alert>
              )}

              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <FormikMuiField formik={formik} name="name" label="Your Name" placeholder="Bhimsen" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormikMuiField formik={formik} name="email" label="Email Address" type="email" placeholder="name@example.com" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormikMuiField
                      formik={formik}
                      name="message"
                      label="Your Message or Inquiry"
                      placeholder="Please specify trip details or questions..."
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={formik.isSubmitting}
                      endIcon={<Send size={16} />}
                      sx={{
                        bgcolor: "#ffffff",
                        color: "#000000",
                        fontWeight: 600,
                        px: 3,
                        py: 1.25,
                        "&:hover": { bgcolor: "#eaeaea" },
                      }}
                    >
                      {formik.isSubmitting ? "Sending..." : "Submit Message"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
