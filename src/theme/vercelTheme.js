import { createTheme } from "@mui/material/styles";

export const vercelTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#0a0a0a",
      subtle: "#111111",
      elevated: "#171717",
    },
    primary: {
      main: "#ffffff",
      contrastText: "#000000",
      light: "#f4f4f5",
      dark: "#d4d4d8",
    },
    secondary: {
      main: "#a1a1aa",
      contrastText: "#ffffff",
      light: "#d4d4d8",
      dark: "#71717a",
    },
    text: {
      primary: "#ededed",
      secondary: "#888888",
      disabled: "#52525b",
    },
    divider: "#222222",
    error: {
      main: "#f43f5e",
      light: "#fb7185",
      dark: "#e11d48",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    info: {
      main: "#38bdf8",
      light: "#7dd3fc",
      dark: "#0284c7",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    action: {
      hover: "rgba(255, 255, 255, 0.06)",
      selected: "rgba(255, 255, 255, 0.12)",
      disabledBackground: "rgba(255, 255, 255, 0.08)",
      disabled: "rgba(255, 255, 255, 0.3)",
    },
  },
  typography: {
    fontFamily: [
      "Geist",
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.75rem",
      fontWeight: 700,
      letterSpacing: "-0.035em",
      lineHeight: 1.15,
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      letterSpacing: "-0.025em",
      lineHeight: 1.25,
    },
    h4: {
      fontSize: "1.375rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      letterSpacing: "-0.015em",
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "0.9375rem",
      letterSpacing: "-0.01em",
      lineHeight: 1.6,
      color: "#d4d4d8",
    },
    body2: {
      fontSize: "0.875rem",
      letterSpacing: "-0.005em",
      lineHeight: 1.5,
      color: "#a1a1aa",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
    caption: {
      fontSize: "0.75rem",
      letterSpacing: "0.01em",
      color: "#71717a",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#000000",
          color: "#ededed",
          scrollbarWidth: "thin",
          scrollbarColor: "#27272a #09090b",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 18px",
          fontSize: "0.875rem",
          fontWeight: 600,
          transition: "all 0.18s ease-in-out",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#ffffff",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#eaeaea",
            transform: "translateY(-1px)",
          },
        },
        outlinedPrimary: {
          borderColor: "#2e2e2e",
          color: "#ededed",
          "&:hover": {
            borderColor: "#ffffff",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
        textPrimary: {
          color: "#ededed",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a0a0a",
          backgroundImage: "none",
          border: "1px solid #222222",
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a0a0a",
          backgroundImage: "none",
          border: "1px solid #222222",
          borderRadius: 12,
          transition: "border-color 0.2s ease, transform 0.2s ease",
          "&:hover": {
            borderColor: "#3f3f46",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#050505",
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#262626",
              transition: "border-color 0.15s ease",
            },
            "&:hover fieldset": {
              borderColor: "#52525b",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ffffff",
              borderWidth: "1px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#71717a",
            "&.Mui-focused": {
              color: "#ffffff",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#050505",
          borderRadius: "8px",
          "& fieldset": {
            borderColor: "#262626",
          },
          "&:hover fieldset": {
            borderColor: "#52525b",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#ffffff",
            borderWidth: "1px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
          border: "1px solid #27272a",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0c0c0c",
          border: "1px solid #27272a",
          borderRadius: 14,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#222222",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #1f1f1f",
          padding: "14px 16px",
          color: "#d4d4d8",
        },
        head: {
          backgroundColor: "#080808",
          color: "#a1a1aa",
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#ffffff",
          height: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          color: "#71717a",
          "&.Mui-selected": {
            color: "#ffffff",
            fontWeight: 600,
          },
        },
      },
    },
  },
});

export default vercelTheme;
