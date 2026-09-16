import React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import vercelTheme from "./theme/vercelTheme";
import router from "./routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider theme={vercelTheme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="dark"
          toastStyle={{
            backgroundColor: "#0a0a0a",
            color: "#ededed",
            border: "1px solid #222222",
            borderRadius: "10px",
            fontFamily: "var(--font-geist)",
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
