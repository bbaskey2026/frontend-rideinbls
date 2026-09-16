import React, { useContext, useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  X as CloseIcon,
  User,
  LogOut,
  LayoutDashboard,
  Car,
  Users,
  Compass,
  CreditCard,
  ChevronDown,
  Shield,
  Sparkles,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import ConfirmationModal from "../common/ConfirmationModal";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
    handleUserMenuClose();
  };

  const handleScrollTo = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    handleUserMenuClose();
    navigate("/");
  };

  const isAdmin = user && user.role === "admin";
  const isAuthenticated = Boolean(user && token);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #1f1f1f",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ height: 68, justifyContent: "space-between" }}>
            {/* Brand Logo & Name */}
            <Box
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                userSelect: "none",
                transition: "opacity 0.2s ease",
                "&:hover": { opacity: 0.85 },
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="rideinbls"
                sx={{
                  height: 34,
                  width: "auto",
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  display: { xs: "none", sm: "block" },
                }}
              >
                RideInBls
              </Typography>
              {isAdmin && (
                <Chip
                  label="ADMIN"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              )}
            </Box>

            {/* Desktop Navigation Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                variant="text"
                onClick={() => navigate("/fleet-catalog")}
                sx={{
                  color: location.pathname === "/fleet-catalog" ? "#ffffff" : "#a1a1aa",
                  fontWeight: location.pathname === "/fleet-catalog" ? 600 : 500,
                  fontSize: "0.875rem",
                  "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                Fleet Catalog
              </Button>
              <Button
                variant="text"
                onClick={() => navigate("/find-route")}
                sx={{
                  color: location.pathname === "/find-route" ? "#ffffff" : "#a1a1aa",
                  fontWeight: location.pathname === "/find-route" ? 600 : 500,
                  fontSize: "0.875rem",
                  "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                Book Ride
              </Button>
              <Button
                variant="text"
                onClick={() => handleScrollTo("cities")}
                sx={{
                  color: "#a1a1aa",
                  fontSize: "0.875rem",
                  "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                Coverage
              </Button>
              <Button
                variant="text"
                onClick={() => handleScrollTo("reviews")}
                sx={{
                  color: "#a1a1aa",
                  fontSize: "0.875rem",
                  "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                Reviews
              </Button>
              <Button
                variant="text"
                onClick={() => handleScrollTo("policies")}
                sx={{
                  color: "#a1a1aa",
                  fontSize: "0.875rem",
                  "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                Policies
              </Button>
            </Box>

            {/* Desktop Auth / User Controls */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Shield size={15} />}
                      onClick={() => navigate("/admin/vehicles")}
                      sx={{
                        color: "#ededed",
                        borderColor: "#27272a",
                        fontSize: "0.8125rem",
                        "&:hover": { borderColor: "#ffffff", bgcolor: "transparent" },
                      }}
                    >
                      Admin Console
                    </Button>
                  )}
                  <Button
                    onClick={handleUserMenuOpen}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      bgcolor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid #222222",
                      color: "#ededed",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)", borderColor: "#333" },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "#ffffff",
                        color: "#000000",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                      }}
                    >
                      {(user?.name || "U")[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 120, noWrap: true }}>
                      {user?.name || "Account"}
                    </Typography>
                    <ChevronDown size={15} color="#888888" />
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        bgcolor: "#0a0a0a",
                        border: "1px solid #222222",
                        boxShadow: "0 16px 36px rgba(0,0,0,0.8)",
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#ffffff" }}>
                        {user?.name || "User"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#71717a", display: "block" }}>
                        {user?.email || user?.mobile || ""}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: "#1f1f1f" }} />
                    <MenuItem onClick={() => handleNavigate("/dashboard")} sx={{ py: 1.25 }}>
                      <ListItemIcon>
                        <LayoutDashboard size={16} color="#a1a1aa" />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate("/profile")} sx={{ py: 1.25 }}>
                      <ListItemIcon>
                        <User size={16} color="#a1a1aa" />
                      </ListItemIcon>
                      <ListItemText primary="Profile Settings" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                    </MenuItem>
                    {isAdmin && (
                      <>
                        <Divider sx={{ borderColor: "#1f1f1f" }} />
                        <MenuItem onClick={() => handleNavigate("/admin/vehicles")} sx={{ py: 1.25 }}>
                          <ListItemIcon>
                            <Car size={16} color="#a1a1aa" />
                          </ListItemIcon>
                          <ListItemText primary="Manage Vehicles" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/admin/users")} sx={{ py: 1.25 }}>
                          <ListItemIcon>
                            <Users size={16} color="#a1a1aa" />
                          </ListItemIcon>
                          <ListItemText primary="Manage Bookings" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/admin/payment-analytics")} sx={{ py: 1.25 }}>
                          <ListItemIcon>
                            <CreditCard size={16} color="#a1a1aa" />
                          </ListItemIcon>
                          <ListItemText primary="Payment Analytics" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                        </MenuItem>
                      </>
                    )}
                    <Divider sx={{ borderColor: "#1f1f1f" }} />
                    <MenuItem
                      onClick={() => {
                        handleUserMenuClose();
                        setShowLogoutModal(true);
                      }}
                      sx={{ py: 1.25, color: "#fb7185" }}
                    >
                      <ListItemIcon>
                        <LogOut size={16} color="#fb7185" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "0.875rem", color: "#fb7185" }} />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="text"
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#ededed",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.06)" },
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/register")}
                    sx={{
                      bgcolor: "#ffffff",
                      color: "#000000",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      "&:hover": { bgcolor: "#eaeaea" },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu Toggle Button */}
            <IconButton
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#ededed",
                p: 1,
              }}
            >
              {mobileOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 290,
            bgcolor: "#080808",
            borderLeft: "1px solid #222222",
            p: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box component="img" src={logo} alt="Logo" sx={{ height: 28 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#fff" }}>
              RideInBls
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setMobileOpen(false)} sx={{ color: "#71717a" }}>
            <CloseIcon size={20} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "#1f1f1f", mb: 2 }} />

        {isAuthenticated && (
          <Box sx={{ p: 1.5, mb: 2, bgcolor: "#111111", borderRadius: 2, border: "1px solid #222" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#fff" }}>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#71717a" }}>
              {user?.role === "admin" ? "Administrator" : "Passenger"}
            </Typography>
          </Box>
        )}

        <List sx={{ p: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton onClick={() => handleNavigate("/fleet-catalog")} sx={{ borderRadius: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Car size={18} color="#a1a1aa" />
              </ListItemIcon>
              <ListItemText primary="Fleet Catalog" primaryTypographyProps={{ fontSize: "0.9rem" }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton onClick={() => handleNavigate("/find-route")} sx={{ borderRadius: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Compass size={18} color="#a1a1aa" />
              </ListItemIcon>
              <ListItemText primary="Book Ride" primaryTypographyProps={{ fontSize: "0.9rem" }} />
            </ListItemButton>
          </ListItem>

          {isAuthenticated && (
            <>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => handleNavigate("/dashboard")} sx={{ borderRadius: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LayoutDashboard size={18} color="#a1a1aa" />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: "0.9rem" }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => handleNavigate("/profile")} sx={{ borderRadius: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <User size={18} color="#a1a1aa" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: "0.9rem" }} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {isAdmin && (
            <>
              <Divider sx={{ borderColor: "#1f1f1f", my: 1.5 }} />
              <Typography variant="caption" sx={{ px: 2, color: "#71717a", fontWeight: 700, textTransform: "uppercase" }}>
                Admin Operations
              </Typography>
              <ListItem disablePadding sx={{ mt: 1, mb: 0.5 }}>
                <ListItemButton onClick={() => handleNavigate("/admin/vehicles")} sx={{ borderRadius: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Car size={18} color="#a1a1aa" />
                  </ListItemIcon>
                  <ListItemText primary="Vehicles" primaryTypographyProps={{ fontSize: "0.9rem" }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => handleNavigate("/admin/users")} sx={{ borderRadius: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Users size={18} color="#a1a1aa" />
                  </ListItemIcon>
                  <ListItemText primary="Bookings" primaryTypographyProps={{ fontSize: "0.9rem" }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => handleNavigate("/admin/payment-analytics")} sx={{ borderRadius: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CreditCard size={18} color="#a1a1aa" />
                  </ListItemIcon>
                  <ListItemText primary="Analytics" primaryTypographyProps={{ fontSize: "0.9rem" }} />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>

        <Box sx={{ mt: "auto", pt: 3 }}>
          {isAuthenticated ? (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogOut size={16} />}
              onClick={() => {
                setMobileOpen(false);
                setShowLogoutModal(true);
              }}
              sx={{
                borderColor: "#3f1a24",
                color: "#fb7185",
                "&:hover": { borderColor: "#f43f5e", bgcolor: "rgba(244, 63, 94, 0.08)" },
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleNavigate("/login")}
                sx={{ borderColor: "#27272a", color: "#ededed" }}
              >
                Log In
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleNavigate("/register")}
                sx={{ bgcolor: "#ffffff", color: "#000" }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Logout Confirmation */}
      <ConfirmationModal
        open={showLogoutModal}
        title="Confirm Logout"
        description="Are you sure you want to log out of your account?"
        confirmText="Logout"
        onConfirm={confirmLogout}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}
