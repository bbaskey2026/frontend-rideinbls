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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  Power,
  Search,
  Filter,
  Users,
  Fuel,
  RefreshCw,
  X as CloseIcon,
  Upload,
} from "lucide-react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";
import API_ENDPOINTS from "../../../config/api";
import StatusBadge from "../../../components/common/StatusBadge";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import PageHeader from "../../../components/common/PageHeader";
import BrandLoader from "../../../components/common/BrandLoader";
import FormikMuiField from "../../../components/common/FormikMuiField";
import { vehicleFormSchema } from "../schemas/adminValidation";

const CATEGORIES = ["Sedan", "SUV", "Luxury", "Hatchback", "Traveller", "Van"];
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic"];

export default function VehicleList() {
  const { token } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, vehicle: null, loading: false });
  const [toggleLoading, setToggleLoading] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_ENDPOINTS.VEHICLES.BASE}?all=true`);
      const list = res.data?.data || res.data?.vehicles || (Array.isArray(res.data) ? res.data : []);
      setVehicles(list);
    } catch (err) {
      console.error("Admin vehicles fetch error:", err);
      toast.error("Failed to load vehicle list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "Sedan",
      modelYear: new Date().getFullYear(),
      capacity: 4,
      luggageCapacity: 3,
      fuelType: "Petrol",
      transmission: "Manual",
      pricePerKm: 14,
      baseFare: 500,
      driverAllowancePerDay: 300,
      description: "",
    },
    validationSchema: vehicleFormSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        if (editingVehicle) {
          await axios.put(
            API_ENDPOINTS.ADMIN.VEHICLES.BY_ID(editingVehicle._id),
            values,
            { headers }
          );
          toast.success("Vehicle updated successfully!");
        } else {
          await axios.post(
            API_ENDPOINTS.ADMIN.VEHICLES.BASE,
            values,
            { headers }
          );
          toast.success("New vehicle added to fleet!");
        }
        setFormOpen(false);
        resetForm();
        setEditingVehicle(null);
        fetchVehicles();
      } catch (err) {
        toast.error(err.response?.data?.message || "Operation failed");
      }
    },
  });

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    formik.resetForm();
    setFormOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVehicle(v);
    formik.setValues({
      name: v.name || "",
      category: v.category || "Sedan",
      modelYear: v.modelYear || 2024,
      capacity: v.capacity || 4,
      luggageCapacity: v.luggageCapacity || 3,
      fuelType: v.fuelType || "Petrol",
      transmission: v.transmission || "Manual",
      pricePerKm: v.pricePerKm || 14,
      baseFare: v.baseFare || 500,
      driverAllowancePerDay: v.driverAllowancePerDay || 300,
      description: v.description || "",
    });
    setFormOpen(true);
  };

  const handleToggleAvailability = async (vehicle) => {
    setToggleLoading(vehicle._id);
    try {
      await axios.patch(
        API_ENDPOINTS.ADMIN.VEHICLES.TOGGLE(vehicle._id),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Availability updated!");
      fetchVehicles();
    } catch (err) {
      toast.error("Failed to toggle status");
    } finally {
      setToggleLoading(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.vehicle) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await axios.delete(
        API_ENDPOINTS.ADMIN.VEHICLES.BY_ID(deleteModal.vehicle._id),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Vehicle removed from catalog.");
      fetchVehicles();
    } catch (err) {
      toast.error("Failed to delete vehicle");
    } finally {
      setDeleteModal({ open: false, vehicle: null, loading: false });
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      (v.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || (v.category || "").toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ bgcolor: "#000000", minHeight: "100vh", pb: 10 }}>
      <PageHeader
        title="Fleet Vehicle Management"
        subtitle="Add, configure rates, and monitor live vehicle status in your operational fleet"
        breadcrumbs={[
          { label: "Admin Console", path: "/admin/vehicles" },
          { label: "Vehicles", path: "/admin/vehicles" },
        ]}
        action={
          <Button
            variant="contained"
            onClick={handleOpenAdd}
            startIcon={<Plus size={16} />}
            sx={{ bgcolor: "#ffffff", color: "#000", fontWeight: 700 }}
          >
            Add New Vehicle
          </Button>
        }
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Search & Filter Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            bgcolor: "#0a0a0a",
            border: "1px solid #222222",
            borderRadius: 3,
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextField
            placeholder="Search vehicles by name, model, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: { xs: "100%", sm: 340 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#71717a" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: { xs: "100%", sm: "auto" } }}>
            <TextField
              select
              size="small"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="All">All Types</MenuItem>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            <IconButton onClick={fetchVehicles} sx={{ color: "#71717a", "&:hover": { color: "#fff" } }}>
              <RefreshCw size={18} />
            </IconButton>
          </Box>
        </Paper>

        {/* Vehicles Table / Card Grid */}
        {loading ? (
          <BrandLoader message="Loading vehicles catalog..." />
        ) : filteredVehicles.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: "center", bgcolor: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 3 }}>
            <Car size={36} color="#52525b" style={{ marginBottom: 12 }} />
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
              No vehicles found
            </Typography>
            <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
              Try adjusting your search criteria or add a new vehicle to the fleet.
            </Typography>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#0a0a0a",
              border: "1px solid #1f1f1f",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle Model</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Rate / KM</TableCell>
                  <TableCell>Base Fare</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVehicles.map((v) => {
                  const isAvailable = !v.isBooked && v.isAvailable !== false;
                  return (
                    <TableRow key={v._id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 44,
                              height: 32,
                              borderRadius: 1,
                              bgcolor: "#111",
                              border: "1px solid #222",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                            }}
                          >
                            <Car size={18} />
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#ededed" }}>
                              {v.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#71717a" }}>
                              {v.modelYear || "2024"} • {v.fuelType || "Petrol"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={v.category || "Sedan"} size="small" sx={{ bgcolor: "#111", color: "#d4d4d8", border: "1px solid #222" }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#a1a1aa" }}>
                          {v.capacity || 4} Seats • {v.luggageCapacity || 3} Bags
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#ffffff" }}>
                          ₹{v.pricePerKm || 14}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#a1a1aa" }}>
                          ₹{v.baseFare || 500}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={isAvailable ? "Available" : "Unavailable"} />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            title="Toggle Availability"
                            onClick={() => handleToggleAvailability(v)}
                            sx={{ color: isAvailable ? "#10b981" : "#71717a" }}
                          >
                            <Power size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Edit Vehicle"
                            onClick={() => handleOpenEdit(v)}
                            sx={{ color: "#ededed" }}
                          >
                            <Edit2 size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Delete Vehicle"
                            onClick={() => setDeleteModal({ open: true, vehicle: v, loading: false })}
                            sx={{ color: "#fb7185" }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>

      {/* Add / Edit Vehicle Dialog with Formik */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "#0a0a0a", border: "1px solid #222222", borderRadius: 3, p: 1 },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, px: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff" }}>
            {editingVehicle ? "Edit Vehicle Specification" : "Add Vehicle to Fleet"}
          </Typography>
          <IconButton size="small" onClick={() => setFormOpen(false)} sx={{ color: "#71717a" }}>
            <CloseIcon size={18} />
          </IconButton>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ px: 2.5, py: 2.5 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormikMuiField formik={formik} name="name" label="Vehicle Name" placeholder="e.g. Swift Dzire ZXi" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  name="category"
                  label="Category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormikMuiField formik={formik} name="modelYear" label="Model Year" type="number" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormikMuiField formik={formik} name="capacity" label="Passenger Capacity" type="number" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormikMuiField formik={formik} name="luggageCapacity" label="Luggage Bags" type="number" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  name="fuelType"
                  label="Fuel Type"
                  value={formik.values.fuelType}
                  onChange={formik.handleChange}
                >
                  {FUEL_TYPES.map((f) => (
                    <MenuItem key={f} value={f}>{f}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  name="transmission"
                  label="Transmission"
                  value={formik.values.transmission}
                  onChange={formik.handleChange}
                >
                  {TRANSMISSIONS.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormikMuiField formik={formik} name="pricePerKm" label="Price per KM (₹)" type="number" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormikMuiField formik={formik} name="baseFare" label="Base Fare (₹)" type="number" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormikMuiField formik={formik} name="driverAllowancePerDay" label="Driver Allowance / Day (₹)" type="number" />
              </Grid>

              <Grid item xs={12}>
                <FormikMuiField formik={formik} name="description" label="Vehicle Description / Features" multiline rows={2} />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 2.5, pb: 2, gap: 1 }}>
            <Button variant="outlined" onClick={() => setFormOpen(false)} sx={{ borderColor: "#27272a", color: "#a1a1aa" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{ bgcolor: "#ffffff", color: "#000", fontWeight: 700 }}
            >
              {formik.isSubmitting ? "Saving..." : editingVehicle ? "Save Changes" : "Create Vehicle"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModal.open}
        title="Delete Vehicle"
        description={`Are you sure you want to permanently delete "${deleteModal.vehicle?.name}" from your operational catalog?`}
        confirmText="Delete Vehicle"
        danger={true}
        loading={deleteModal.loading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ open: false, vehicle: null, loading: false })}
      />
    </Box>
  );
}
