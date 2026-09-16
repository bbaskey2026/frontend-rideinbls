import React from "react";
import { Box, Container, Typography, Grid, Paper, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Shield, ChevronDown, RefreshCw, FileText, Lock } from "lucide-react";

const POLICY_ITEMS = [
  {
    id: "cancellation",
    title: "Cancellation & 100% Refund Policy",
    icon: <RefreshCw size={18} color="#ffffff" />,
    summary: "Full refund if cancelled up to 2 hours prior to scheduled departure.",
    content: "Passengers can cancel bookings with zero cancellation penalty up to 2 hours before the scheduled departure time. For cancellations made within 2 hours, a nominal driver mobilization fee of 15% applies. Refunds are processed automatically to the original payment method within 24-48 business hours.",
  },
  {
    id: "safety",
    title: "Passenger Safety & Chauffeur Verification",
    icon: <Shield size={18} color="#ffffff" />,
    summary: "Background verified chauffeurs and 24/7 SOS tracking.",
    content: "All drivers undergo comprehensive background screening, police verification, and vehicle safety inspections. Trips are monitored in real-time via telemetry with emergency response escalation.",
  },
  {
    id: "pricing",
    title: "Transparent Fixed Pricing Guarantee",
    icon: <FileText size={18} color="#ffffff" />,
    summary: "All-inclusive toll, fuel, and driver allowances upfront.",
    content: "The fare shown during booking calculation is exact. No sudden surge pricing, no unannounced highway toll markups, and driver day allowances are clearly listed before payment confirmation.",
  },
  {
    id: "privacy",
    title: "Data Privacy & Transaction Security",
    icon: <Lock size={18} color="#ffffff" />,
    summary: "256-bit SSL encrypted payments and secure credentials.",
    content: "We never store raw credit/debit card numbers. All transactions are tokenized through RBI-authorized payment gateways adhering to strict PCI-DSS compliance standards.",
  },
];

export default function Policies() {
  return (
    <Box id="policies" sx={{ py: 10, bgcolor: "#050505", borderTop: "1px solid #1f1f1f" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.5, bgcolor: "#111", border: "1px solid #222", borderRadius: 5, mb: 1.5 }}>
            <Shield size={14} color="#ffffff" />
            <Typography variant="caption" sx={{ color: "#a1a1aa", fontWeight: 600 }}>
              Terms & Safety
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
            Policies & Passenger Protection
          </Typography>
          <Typography variant="body1" sx={{ color: "#888888", mt: 1, maxWidth: 580, mx: "auto" }}>
            Designed for clear expectations, guaranteed reliability, and seamless refund processing.
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 880, mx: "auto" }}>
          {POLICY_ITEMS.map((item, index) => (
            <Accordion
              key={item.id}
              defaultExpanded={index === 0}
              sx={{
                bgcolor: "#0a0a0a",
                border: "1px solid #1f1f1f",
                borderRadius: "12px !important",
                mb: 2,
                "&:before": { display: "none" },
                "&.Mui-expanded": {
                  borderColor: "#3f3f46",
                  bgcolor: "#0d0d0d",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={18} color="#71717a" />}
                sx={{ px: 3, py: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ p: 1, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 1.5, display: "flex" }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#ffffff" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      {item.summary}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Typography variant="body2" sx={{ color: "#a1a1aa", lineHeight: 1.7 }}>
                  {item.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
