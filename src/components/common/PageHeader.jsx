import React from "react";
import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  action = null,
}) {
  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
        borderBottom: "1px solid #1f1f1f",
        backgroundColor: "#050505",
        mb: 4,
      }}
    >
      <Box sx={{ maxWidth: "lg", mx: "auto", px: { xs: 0, md: 0 } }}>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<ChevronRight size={14} color="#52525b" />}
            sx={{ mb: 1.5 }}
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return isLast ? (
                <Typography
                  key={idx}
                  variant="caption"
                  sx={{ color: "#ededed", fontWeight: 500, fontSize: "0.8rem" }}
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={idx}
                  component={RouterLink}
                  to={crumb.path || "#"}
                  underline="hover"
                  sx={{ color: "#71717a", fontSize: "0.8rem", "&:hover": { color: "#ffffff" } }}
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em" }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: "#888888", mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}>{action}</Box>}
        </Box>
      </Box>
    </Box>
  );
}
