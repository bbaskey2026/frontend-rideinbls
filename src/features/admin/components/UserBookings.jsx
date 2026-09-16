import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Users,
  Search,
  RefreshCw,
  Ban,
  CheckCircle,
  Calendar,
  MapPin,
  Car,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";
import API_ENDPOINTS from "../../../config/api";
import StatusBadge from "../../../components/common/StatusBadge";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import PageHeader from "../../../components/common/PageHeader";
import BrandLoader from "../../../components/common/BrandLoader";

export default function UserBookings() {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionModal, setActionModal] = useState({ open: false, user: null, action: "block", loading: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch users
      try {
        const userRes = await axios.get(API_ENDPOINTS.ADMIN.USERS.BASE, { headers });
        const uList = userRes.data?.data || userRes.data?.users || (Array.isArray(userRes.data) ? userRes.data : []);
        setUsers(uList);
      } catch (e) {
        console.warn("Admin users fetch error:", e);
      }

      // Fetch all bookings
      try {
        const bookRes = await axios.get(API_ENDPOINTS.VEHICLES.MY_BOOKINGS, { headers });
        const bList = bookRes.data?.data || (Array.isArray(bookRes.data) ? bookRes.data : []);
        setBookings(bList);
      } catch (e) {
        console.warn("Bookings fetch error:", e);
      }
    } catch (err) {
      toast.error("Failed to load administration data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleToggleUserBlock = async () => {
    if (!actionModal.user) return;
    setActionModal((prev) => ({ ...prev, loading: true }));
    try {
      const isBlocked = actionModal.user.isBlocked;
      const endpoint = isBlocked
        ? API_ENDPOINTS.ADMIN.USERS.UNBLOCK(actionModal.user._id)
        : API_ENDPOINTS.ADMIN.USERS.BLOCK(actionModal.user._id);

      await axios.patch(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update user status");
    } finally {
      setActionModal({ open: false, user: null, action: "block", loading: false });
    }
  };

  const filteredBookings = bookings.filter((b) =>
    (b.bookingCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.origin || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.destination || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.mobile || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: "#000000", minHeight: "100vh", pb: 10 }}>
      <PageHeader
        title="Rides & User Management"
        subtitle="Monitor system reservations, passenger registrations, and access controls"
        breadcrumbs={[
          { label: "Admin Console", path: "/admin/vehicles" },
          { label: "Bookings & Users", path: "/admin/users" },
        ]}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2, mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              bgcolor: "#0a0a0a",
              border: "1px solid #222222",
              borderRadius: 2.5,
              p: 0.5,
              minHeight: 40,
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab value="bookings" label={`Platform Bookings (${bookings.length})`} sx={{ minHeight: 32, borderRadius: 2, fontSize: "0.8125rem", color: "#71717a", "&.Mui-selected": { bgcolor: "#222", color: "#fff" } }} />
            <Tab value="users" label={`Registered Passengers (${users.length})`} sx={{ minHeight: 32, borderRadius: 2, fontSize: "0.8125rem", color: "#71717a", "&.Mui-selected": { bgcolor: "#222", color: "#fff" } }} />
          </Tabs>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: { xs: "100%", sm: "auto" } }}>
            <TextField
              size="small"
              placeholder={activeTab === "bookings" ? "Search booking ID, route..." : "Search user by name, email, phone..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 300 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#71717a" />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton onClick={fetchData} sx={{ color: "#71717a", "&:hover": { color: "#fff" } }}>
              <RefreshCw size={18} />
            </IconButton>
          </Box>
        </Box>

        {loading ? (
          <BrandLoader message="Loading data..." />
        ) : activeTab === "bookings" ? (
          <Paper elevation={0} sx={{ bgcolor: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 3, overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking Code</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Pickup & Drop</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Total Fare</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#71717a" }}>
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((b) => (
                    <TableRow key={b._id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#ffffff", fontFamily: "monospace" }}>
                          {b.bookingCode || b._id?.slice(-8)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#ededed" }}>
                          {b.vehicle?.name || "Executive Car"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#d4d4d8" }}>{b.origin} → {b.destination}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: "#a1a1aa" }}>
                          {b.startDate ? new Date(b.startDate).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "Scheduled"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#ffffff" }}>
                          ₹{b.totalPrice || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={b.status || "confirmed"} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ bgcolor: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 3, overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Account Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#71717a" }}>
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u._id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#ededed" }}>
                          {u.name || "Passenger"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#a1a1aa" }}>{u.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#a1a1aa" }}>{u.mobile || "N/A"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={u.role || "user"} size="small" sx={{ bgcolor: "#111", color: "#d4d4d8", border: "1px solid #222" }} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={u.isBlocked ? "Blocked" : "Active"} />
                      </TableCell>
                      <TableCell align="right">
                        {u.role !== "admin" && (
                          <Button
                            size="small"
                            variant="outlined"
                            color={u.isBlocked ? "success" : "error"}
                            onClick={() => setActionModal({ open: true, user: u, action: u.isBlocked ? "unblock" : "block", loading: false })}
                            sx={{
                              borderColor: u.isBlocked ? "#166534" : "#991b1b",
                              fontSize: "0.75rem",
                              py: 0.25,
                            }}
                          >
                            {u.isBlocked ? "Unblock" : "Block User"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>

      {/* Block / Unblock Confirmation Modal */}
      <ConfirmationModal
        open={actionModal.open}
        title={`${actionModal.action === "block" ? "Block" : "Unblock"} User`}
        description={`Are you sure you want to ${actionModal.action} user ${actionModal.user?.name} (${actionModal.user?.email})?`}
        confirmText={actionModal.action === "block" ? "Block Account" : "Unblock Account"}
        danger={actionModal.action === "block"}
        loading={actionModal.loading}
        onConfirm={handleToggleUserBlock}
        onClose={() => setActionModal({ open: false, user: null, action: "block", loading: false })}
      />
    </Box>
  );
}
