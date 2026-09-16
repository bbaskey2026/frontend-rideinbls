import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#000000",
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
