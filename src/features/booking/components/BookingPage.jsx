import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  ClickAwayListener,
  Menu,
  MenuItem,
} from "@mui/material";

import {
  Car,
  Clock,
  Package,
  Key,
  Navigation,
  ArrowUpDown,
  Search,
  Calendar,
  X as CloseIcon,
  ChevronDown,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import API_ENDPOINTS from "../../../config/api";

const SERVICES = [
  { id: "ride", label: "Ride", icon: <Car size={18} /> },
  { id: "reserve", label: "Reserve", icon: <Clock size={18} /> },
  { id: "package", label: "Package", icon: <Package size={18} /> },
  { id: "rentals", label: "Rentals", icon: <Key size={18} /> },
];

export default function BookingPage({ isHero = false }) {
  const [activeService, setActiveService] = useState("ride");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null); // 'source' or 'destination'
  const [searchingPlace, setSearchingPlace] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("now"); // 'now' or 'scheduled'
  const [scheduleDate, setScheduleDate] = useState("");

  const [anchorElTime, setAnchorElTime] = useState(null);

  const containerRef = useRef(null);
  const navigate = useNavigate();

  const fetchCurrentLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const locationString =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setCurrentLocation(locationString);
            setSource(locationString);
          } catch (err) {
            console.error("Reverse geocoding error:", err);
          }
          setLoadingLocation(false);
        },
        async () => {
          try {
            const res = await axios.get("/api/geo");
            const loc = `${res.data.city}, ${res.data.region}`;
            setCurrentLocation(loc);
            setSource(loc);
          } catch (error) {
            console.error("Fallback error:", error);
          }
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const debounceTimer = useRef(null);
  const cacheRef = useRef(new Map());

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleInputChange = (value, type) => {
    if (type === "source") setSource(value);
    else setDestination(value);

    setActiveField(type);

    const term = (value || "").trim().toLowerCase();

    // Clear any pending debounce request
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (term.length < 2) {
      setSuggestions([]);
      setSearchingPlace(false);
      return;
    }

    // Check in-memory cache first (instant response, zero API call)
    if (cacheRef.current.has(term)) {
      setSuggestions(cacheRef.current.get(term));
      setSearchingPlace(false);
      return;
    }

    setSearchingPlace(true);

    // Debounce API hit by 350ms
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${API_ENDPOINTS.GOOGLE.AUTOCOMPLETE}?input=${encodeURIComponent(term)}`
        );
        const predictions = res.data?.predictions || [];
        cacheRef.current.set(term, predictions);
        setSuggestions(predictions);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setSearchingPlace(false);
      }
    }, 350);
  };


  const handleSelectPlace = async (place) => {
    try {
      const res = await axios.get(
        `${API_ENDPOINTS.GOOGLE.DETAILS}?place_id=${place.place_id}`
      );
      const formatted = res.data.result?.formatted_address || place.description;
      if (activeField === "source") setSource(formatted);
      else setDestination(formatted);
    } catch (err) {
      if (activeField === "source") setSource(place.description);
      else setDestination(place.description);
    } finally {
      setSuggestions([]);
      setActiveField(null);
    }
  };

  const handleSwapLocations = (e) => {
    e.stopPropagation();
    setSource(destination);
    setDestination(source);
  };

  const handleFindVehicles = () => {
    if (!source.trim() || !destination.trim()) {
      alert("Please enter both pickup and drop-off locations.");
      return;
    }
    navigate(
      `/finding-vehicles?source=${encodeURIComponent(source.trim())}&destination=${encodeURIComponent(destination.trim())}${scheduleDate ? `&startAt=${encodeURIComponent(scheduleDate)}` : ""}`
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setSuggestions([])}>
      <Paper
        ref={containerRef}
        elevation={0}
        sx={{
          bgcolor: "#000000",
          border: "1px solid #222222",
          borderRadius: 4,
          p: { xs: 2.5, sm: 3.5 },
          width: "100%",
          maxWidth: isHero ? "100%" : 540,
          boxShadow: "0 30px 60px -15px rgba(0,0,0,0.9)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Uber Style Service Category Selector */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
            pb: 2,
            borderBottom: "1px solid #1a1a1a",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {SERVICES.map((srv) => {
            const isSelected = activeService === srv.id;
            return (
              <Button
                key={srv.id}
                onClick={() => setActiveService(srv.id)}
                startIcon={srv.icon}
                sx={{
                  bgcolor: isSelected ? "#ffffff" : "transparent",
                  color: isSelected ? "#000000" : "#a1a1aa",
                  borderRadius: 6,
                  px: 2,
                  py: 0.8,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: isSelected ? "#ffffff" : "rgba(255,255,255,0.08)",
                    color: isSelected ? "#000000" : "#ffffff",
                  },
                }}
              >
                {srv.label}
              </Button>
            );
          })}
        </Box>

        {/* Uber Signature Connected Input Box */}
        <Box sx={{ position: "relative", mb: 2.5 }}>
          {/* Visual Connector (Circle -> Line -> Square) */}
          <Box
            sx={{
              position: "absolute",
              left: 20,
              top: 26,
              bottom: 26,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            {/* Pickup Circle */}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#ffffff",
                boxShadow: "0 0 8px rgba(255,255,255,0.8)",
              }}
            />
            {/* Connecting Vertical Bar */}
            <Box
              sx={{
                width: 2,
                flexGrow: 1,
                my: 0.5,
                bgcolor: "#3f3f46",
                borderRadius: 1,
              }}
            />
            {/* Destination Square */}
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: "#ffffff",
                borderRadius: "1px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Pickup Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#111111",
                border: "1px solid",
                borderColor: activeField === "source" ? "#ffffff" : "#222222",
                borderRadius: 2.5,
                pl: 5,
                pr: 1.5,
                height: 54,
                transition: "border-color 0.15s ease, background 0.15s ease",
                "&:hover": { bgcolor: "#141414" },
              }}
            >
              <Box
                component="input"
                type="text"
                placeholder="Pickup location"
                value={source}
                onChange={(e) => handleInputChange(e.target.value, "source")}
                onFocus={() => setActiveField("source")}
                sx={{
                  flexGrow: 1,
                  bgcolor: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  fontFamily: "inherit",
                  "&::placeholder": { color: "#71717a" },
                }}
              />
              {source ? (
                <IconButton
                  size="small"
                  onClick={() => setSource("")}
                  sx={{ color: "#71717a", "&:hover": { color: "#fff" } }}
                >
                  <CloseIcon size={16} />
                </IconButton>
              ) : loadingLocation ? (
                <CircularProgress size={16} sx={{ color: "#888" }} />
              ) : (
                <IconButton
                  size="small"
                  title="Locate Me"
                  onClick={fetchCurrentLocation}
                  sx={{ color: "#71717a", "&:hover": { color: "#fff" } }}
                >
                  <Navigation size={16} />
                </IconButton>
              )}
            </Box>

            {/* Dropoff Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#111111",
                border: "1px solid",
                borderColor: activeField === "destination" ? "#ffffff" : "#222222",
                borderRadius: 2.5,
                pl: 5,
                pr: 1.5,
                height: 54,
                transition: "border-color 0.15s ease, background 0.15s ease",
                "&:hover": { bgcolor: "#141414" },
              }}
            >
              <Box
                component="input"
                type="text"
                placeholder="Drop-off location"
                value={destination}
                onChange={(e) => handleInputChange(e.target.value, "destination")}
                onFocus={() => setActiveField("destination")}
                sx={{
                  flexGrow: 1,
                  bgcolor: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  fontFamily: "inherit",
                  "&::placeholder": { color: "#71717a" },
                }}
              />
              {destination && (
                <IconButton
                  size="small"
                  onClick={() => setDestination("")}
                  sx={{ color: "#71717a", "&:hover": { color: "#fff" } }}
                >
                  <CloseIcon size={16} />
                </IconButton>
              )}
              {/* Swap Button */}
              <IconButton
                size="small"
                onClick={handleSwapLocations}
                title="Swap Locations"
                sx={{
                  color: "#71717a",
                  ml: 0.5,
                  "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.06)" },
                }}
              >
                <ArrowUpDown size={16} />
              </IconButton>
            </Box>
          </Box>

          {/* Autocomplete Suggestions Overlay Popup */}
          {suggestions.length > 0 && activeField && (
            <ClickAwayListener onClickAway={() => setActiveField(null)}>
              <Paper
                elevation={0}
                onMouseDown={(e) => e.preventDefault()} // Prevents input blur before click registers
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "100%",
                  mt: 1,
                  bgcolor: "#0c0c0c",
                  border: "1px solid #27272a",
                  borderRadius: 2.5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.9)",
                  zIndex: 999,
                  maxHeight: 260,
                  overflowY: "auto",
                  p: 0.5,
                }}
              >
                <List disablePadding>
                  {suggestions.map((item, idx) => (
                    <ListItem key={item.place_id || idx} disablePadding>
                      <ListItemButton
                        onClick={() => handleSelectPlace(item)}
                        sx={{
                          borderRadius: 1.5,
                          py: 1,
                          px: 1.5,
                          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <MapPin size={16} color="#ffffff" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.structured_formatting?.main_text || item.description}
                          secondary={item.structured_formatting?.secondary_text}
                          primaryTypographyProps={{
                            fontSize: "0.875rem",
                            color: "#ffffff",
                            fontWeight: 600,
                          }}
                          secondaryTypographyProps={{
                            fontSize: "0.75rem",
                            color: "#a1a1aa",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </ClickAwayListener>
          )}
        </Box>


        {/* Uber Style Schedule Pill / Action Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<Clock size={16} />}
            endIcon={<ChevronDown size={14} />}
            onClick={(e) => setAnchorElTime(e.currentTarget)}
            sx={{
              borderColor: "#222222",
              bgcolor: "#0d0d0d",
              color: "#ededed",
              borderRadius: 5,
              px: 2,
              py: 0.75,
              fontSize: "0.8125rem",
              fontWeight: 600,
              "&:hover": { borderColor: "#3f3f46", bgcolor: "#141414" },
            }}
          >
            {scheduleTime === "now" ? "Pickup now" : "Scheduled ride"}
          </Button>

          <Menu
            anchorEl={anchorElTime}
            open={Boolean(anchorElTime)}
            onClose={() => setAnchorElTime(null)}
            PaperProps={{
              sx: {
                bgcolor: "#0a0a0a",
                border: "1px solid #222222",
                minWidth: 180,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setScheduleTime("now");
                setScheduleDate("");
                setAnchorElTime(null);
              }}
              sx={{ fontSize: "0.875rem", color: "#fff", display: "flex", alignItems: "center", gap: 1.25 }}
            >
              <Zap size={16} color="#10b981" />
              Pickup immediately
            </MenuItem>
            <MenuItem
              onClick={() => {
                setScheduleTime("scheduled");
                setAnchorElTime(null);
              }}
              sx={{ fontSize: "0.875rem", color: "#fff", display: "flex", alignItems: "center", gap: 1.25 }}
            >
              <Clock size={16} color="#38bdf8" />
              Schedule for later
            </MenuItem>
          </Menu>

          <Typography variant="caption" sx={{ color: "#71717a", fontWeight: 500 }}>
            Fixed fare • No surge
          </Typography>
        </Box>

        {/* Scheduled Date Picker If Active */}
        {scheduleTime === "scheduled" && (
          <Box sx={{ mb: 2.5 }}>
            <Box
              component="input"
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              sx={{
                width: "100%",
                bgcolor: "#111111",
                border: "1px solid #27272a",
                borderRadius: 2,
                p: 1.5,
                color: "#ffffff",
                fontSize: "0.875rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </Box>
        )}

        {/* Uber Giant Action Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleFindVehicles}
          sx={{
            bgcolor: "#ffffff",
            color: "#000000",
            py: 1.6,
            borderRadius: 2.5,
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#eaeaea",
              transform: "translateY(-1px)",
            },
          }}
        >
          See prices
        </Button>
      </Paper>
    </ClickAwayListener>
  );
}
