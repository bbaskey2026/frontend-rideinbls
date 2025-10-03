import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Car, Plus, Search, Filter, RefreshCw, CheckCircle, XCircle, MapPin, Fuel,
  Calendar, AlertCircle, Download, Eye, Edit3, Trash2, Settings, Users,
  IndianRupee, Zap, ZapOff, X, Check, Upload
} from "lucide-react";
import "./VehicleList.css";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../config/api";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState({});
  
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  
  const [editFormData, setEditFormData] = useState({
    name: '', brand: '', type: '', licensePlate: '', capacity: '',
    pricePerDay: '', pricePerKM: '', location: '', fuelType: '',
    transmission: '', year: '', color: '', features: '', isAvailable: true
  });

  const [addFormData, setAddFormData] = useState({
    name: '', brand: '', type: '', licensePlate: '', capacity: '',
    pricePerDay: '', pricePerKM: '', location: '', fuelType: '',
    transmission: '', year: new Date().getFullYear(), color: '',
    features: '', isAvailable: true
  });
  
  // Image handling
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  
  const modalContentRef = useRef(null);
  const navigate = useNavigate();

  // Modal scroll lock
  useEffect(() => {
    if (showAddModal || showEditModal || showViewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showAddModal, showEditModal, showViewModal]);

  // Cleanup blob URLs
  const cleanupImageUrls = useCallback(() => {
    imagePreviewUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        try { URL.revokeObjectURL(url); } 
        catch (error) { console.warn('Failed to revoke URL:', error); }
      }
    });
  }, [imagePreviewUrls]);

  useEffect(() => {
    return () => { cleanupImageUrls(); };
  }, [cleanupImageUrls]);

  /* =========================================================
     IMAGE HANDLING
  ========================================================= */

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = files.filter((file) => validTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      toast.warning("Please select only image files (JPEG, PNG, WebP)", {
        position: "top-center", autoClose: 4000
      });
      return;
    }

    const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.warning("Each image must be smaller than 5MB", {
        position: "top-center", autoClose: 4000
      });
      return;
    }

    const totalImages = selectedImages.length + existingImages.length + validFiles.length;
    if (totalImages > 5) {
      toast.warning("Maximum 5 images allowed per vehicle", {
        position: "top-center", autoClose: 4000
      });
      return;
    }

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...validFiles]);
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    try { URL.revokeObjectURL(imagePreviewUrls[index]); } 
    catch (error) { console.warn('Failed to revoke URL:', error); }
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl) => {
    setImagesToRemove(prev => [...prev, imageUrl]);
    setExistingImages(prev => prev.filter(url => url !== imageUrl));
  };

  /* =========================================================
     BULK OPERATIONS
  ========================================================= */

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(currentVehicles.map(v => v._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectVehicle = (vehicleId) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };

  const bulkToggleAvailability = async (makeAvailable) => {
    if (selectedVehicles.length === 0) {
      toast.warning("Please select vehicles first", { position: "top-center", autoClose: 3000 });
      return;
    }

    const action = makeAvailable ? 'make available' : 'make unavailable';
    if (!window.confirm(`Are you sure you want to ${action} ${selectedVehicles.length} vehicle(s)?`)) {
      return;
    }

    setActionLoading(prev => ({ ...prev, bulk_toggle: true }));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post(
        `${API_ENDPOINTS.ADMIN.VEHICLES.BASE}/bulk-toggle`,
        { vehicleIds: selectedVehicles, isAvailable: makeAvailable },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle =>
          selectedVehicles.includes(vehicle._id) 
            ? { ...vehicle, isAvailable: makeAvailable } 
            : vehicle
        )
      );

      toast.success(`${selectedVehicles.length} vehicle(s) ${action}d`, { 
        position: "top-center", autoClose: 3000 
      });
      setSelectedVehicles([]);
      setSelectAll(false);
    } catch (err) {
      console.error('Bulk toggle error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update vehicles';
      toast.error(`Error: ${errorMessage}`, { position: "top-center", autoClose: 5000 });
    } finally {
      setActionLoading(prev => ({ ...prev, bulk_toggle: false }));
    }
  };

  const bulkDeleteVehicles = async () => {
    if (selectedVehicles.length === 0) {
      toast.warning("Please select vehicles first", { position: "top-center", autoClose: 3000 });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedVehicles.length} vehicle(s)? This cannot be undone.`)) {
      return;
    }

    setActionLoading(prev => ({ ...prev, bulk_delete: true }));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.delete(
        `${API_ENDPOINTS.ADMIN.VEHICLES.BASE}/bulk-delete`,
        { 
          data: { vehicleIds: selectedVehicles },
          headers: { Authorization: token ? `Bearer ${token}` : "" } 
        }
      );

      setVehicles(prevVehicles =>
        prevVehicles.filter(vehicle => !selectedVehicles.includes(vehicle._id))
      );

      toast.success(response.data.message || 'Vehicles deleted', { 
        position: "top-center", autoClose: 3000 
      });
      setSelectedVehicles([]);
      setSelectAll(false);
    } catch (err) {
      console.error('Bulk delete error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete vehicles';
      toast.error(`Error: ${errorMessage}`, { position: "top-center", autoClose: 5000 });
    } finally {
      setActionLoading(prev => ({ ...prev, bulk_delete: false }));
    }
  };

  /* =========================================================
     MODAL HANDLERS
  ========================================================= */

  const openAddModal = () => {
    setAddFormData({
      name: '', brand: '', type: '', licensePlate: '', capacity: '',
      pricePerDay: '', pricePerKM: '', location: '', fuelType: '',
      transmission: '', year: new Date().getFullYear(), color: '',
      features: '', isAvailable: true
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setExistingImages([]);
    setImagesToRemove([]);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    cleanupImageUrls();
    setAddFormData({
      name: '', brand: '', type: '', licensePlate: '', capacity: '',
      pricePerDay: '', pricePerKM: '', location: '', fuelType: '',
      transmission: '', year: new Date().getFullYear(), color: '',
      features: '', isAvailable: true
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const openViewModal = async (vehicleId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(
        API_ENDPOINTS.ADMIN.VEHICLES.BY_ID(vehicleId),
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      
      setViewingVehicle(response.data.vehicle || response.data);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
      toast.error('Failed to load vehicle details', { position: "top-center", autoClose: 3000 });
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingVehicle(null);
  };

  const openEditModal = (vehicle) => {
    if (!vehicle || !vehicle._id) {
      toast.error('Error: Invalid vehicle data', { position: "top-center", autoClose: 5000 });
      return;
    }

    setEditingVehicle(vehicle);
    setEditFormData({
      name: vehicle.name || '',
      brand: vehicle.brand || '',
      type: vehicle.type || '',
      licensePlate: vehicle.licensePlate || '',
      capacity: vehicle.capacity || '',
      pricePerDay: vehicle.pricePerDay || vehicle.pricePerHour || '',
      pricePerKM: vehicle.pricePerKM || '',
      location: vehicle.location || '',
      fuelType: vehicle.fuelType || '',
      transmission: vehicle.transmission || '',
      year: vehicle.year || new Date().getFullYear(),
      color: vehicle.color || '',
      features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : vehicle.features || '',
      isAvailable: vehicle.isAvailable !== undefined ? vehicle.isAvailable : true
    });
    
    setExistingImages(vehicle.images || []);
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setImagesToRemove([]);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingVehicle(null);
    cleanupImageUrls();
    setEditFormData({
      name: '', brand: '', type: '', licensePlate: '', capacity: '',
      pricePerDay: '', pricePerKM: '', location: '', fuelType: '',
      transmission: '', year: '', color: '', features: '', isAvailable: true
    });
    setExistingImages([]);
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setImagesToRemove([]);
  };

  const handleAddInputChange = (field, value) => {
    setAddFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  /* =========================================================
     CRUD OPERATIONS
  ========================================================= */

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(API_ENDPOINTS.ADMIN.VEHICLES.BASE, { headers });

      let vehicleData = [];
      if (res.data.success && res.data.vehicles) {
        vehicleData = res.data.vehicles;
      } else if (res.data.data) {
        vehicleData = res.data.data;
      } else if (Array.isArray(res.data)) {
        vehicleData = res.data;
      } else {
        throw new Error('Invalid response format');
      }

      const sanitizedVehicles = vehicleData.map((vehicle, index) => {
        const vehicleId = vehicle._id || vehicle.id;
        if (!vehicleId) {
          console.error(`Vehicle at index ${index} missing ID:`, vehicle);
          return null;
        }

        return {
          _id: vehicleId,
          name: vehicle.name || 'Unknown Vehicle',
          brand: vehicle.brand || 'Unknown Brand',
          type: vehicle.type || 'Unknown Type',
          licensePlate: vehicle.licensePlate || 'No Plate',
          capacity: vehicle.capacity || 0,
          pricePerDay: vehicle.pricePerDay || vehicle.pricePerHour || 0,
          pricePerKM: vehicle.pricePerKM || 0,
          isAvailable: vehicle.isAvailable !== undefined ? vehicle.isAvailable : true,
          location: vehicle.location || 'Unknown Location',
          images: vehicle.images || [],
          features: vehicle.features || [],
          fuelType: vehicle.fuelType || 'Unknown',
          transmission: vehicle.transmission || 'Unknown',
          year: vehicle.year || new Date().getFullYear(),
          color: vehicle.color || 'Unknown',
          createdAt: vehicle.createdAt || new Date().toISOString(),
          updatedAt: vehicle.updatedAt || vehicle.createdAt || new Date().toISOString(),
          bookingsCount: vehicle.bookingsCount || 0,
          activeBookings: vehicle.activeBookings || 0,
          completedBookings: vehicle.completedBookings || 0
        };
      }).filter(vehicle => vehicle !== null);

      setVehicles(sanitizedVehicles);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error ||
        err.message || 'Failed to fetch vehicles';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async () => {
    if (!addFormData.name.trim() || !addFormData.brand.trim() || !addFormData.licensePlate.trim()) {
      toast.warning("Please fill in all required fields (Name, Brand, License Plate)", {
        position: "top-center", autoClose: 4000
      });
      return;
    }

    setActionLoading((prev) => ({ ...prev, add_vehicle: true }));

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", addFormData.name.trim());
      formData.append("brand", addFormData.brand.trim());
      formData.append("type", addFormData.type.trim());
      formData.append("licensePlate", addFormData.licensePlate.trim().toUpperCase());
      formData.append("capacity", String(addFormData.capacity || "4"));
      formData.append("pricePerHour", String(addFormData.pricePerDay || "0"));
      formData.append("pricePerKM", String(addFormData.pricePerKM || "0"));
      formData.append("location", addFormData.location.trim());
      formData.append("fuelType", addFormData.fuelType.trim());
      formData.append("transmission", addFormData.transmission.trim());
      formData.append("year", String(addFormData.year || new Date().getFullYear()));
      formData.append("color", addFormData.color.trim());
      formData.append("features", addFormData.features.trim());
      formData.append("isAvailable", addFormData.isAvailable ? "true" : "false");

      // Append image files
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        API_ENDPOINTS.ADMIN.VEHICLES.BASE,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Vehicle added successfully!", {
        position: "top-center", autoClose: 3000
      });

      closeAddModal();
      fetchVehicles();
    } catch (err) {
      console.error("Error adding vehicle:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 
        err.message || "Failed to add vehicle";
      
      if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
        toast.error(`Validation Error: ${err.response.data.details.join(', ')}`, {
          position: "top-center", autoClose: 6000
        });
      } else {
        toast.error(`Error: ${errorMessage}`, {
          position: "top-center", autoClose: 5000
        });
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, add_vehicle: false }));
    }
  };

  const updateVehicle = async () => {
    if (!editingVehicle || !editingVehicle._id) {
      toast.error('Error: No vehicle selected for editing', { position: "top-center", autoClose: 5000 });
      return;
    }

    if (!editFormData.name.trim() || !editFormData.brand.trim() || !editFormData.licensePlate.trim()) {
      toast.warning('Please fill in all required fields (Name, Brand, License Plate)', {
        position: "top-center", autoClose: 4000
      });
      return;
    }

    setActionLoading(prev => ({ ...prev, [`update_${editingVehicle._id}`]: true }));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const formData = new FormData();

      formData.append("name", editFormData.name.trim());
      formData.append("brand", editFormData.brand.trim());
      formData.append("type", editFormData.type.trim());
      formData.append("licensePlate", editFormData.licensePlate.trim().toUpperCase());
      formData.append("capacity", String(editFormData.capacity || "4"));
      formData.append("pricePerHour", String(editFormData.pricePerDay || "0"));
      formData.append("pricePerKM", String(editFormData.pricePerKM || "0"));
      formData.append("location", editFormData.location.trim());
      formData.append("fuelType", editFormData.fuelType.trim());
      formData.append("transmission", editFormData.transmission.trim());
      formData.append("year", String(editFormData.year || new Date().getFullYear()));
      formData.append("color", editFormData.color.trim());
      formData.append("features", editFormData.features.trim());
      formData.append("isAvailable", editFormData.isAvailable ? "true" : "false");

      // Append new image files
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      // Append images to remove
      if (imagesToRemove.length > 0) {
        formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
      }

      await axios.put(
        API_ENDPOINTS.ADMIN.VEHICLES.BY_ID(editingVehicle._id),
        formData,
        { 
          headers: { 
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data"
          } 
        }
      );

      toast.success('Vehicle updated successfully', { position: "top-center", autoClose: 3000 });
      closeEditModal();
      fetchVehicles();
    } catch (err) {
      console.error("Error updating vehicle:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error ||
        err.message || 'Failed to update vehicle';
      toast.error(`Error: ${errorMessage}`, { position: "top-center", autoClose: 5000 });
    } finally {
      setActionLoading(prev => ({ ...prev, [`update_${editingVehicle._id}`]: false }));
    }
  };

  const deleteVehicle = async (vehicleId) => {
    if (!vehicleId || vehicleId === 'undefined' || vehicleId === 'null') {
      toast.error('Error: Invalid vehicle ID', { position: "top-center", autoClose: 5000 });
      return;
    }

    if (!window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [`delete_${vehicleId}`]: true }));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(API_ENDPOINTS.ADMIN.VEHICLES.BY_ID(vehicleId), { headers });
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle._id !== vehicleId));
      toast.success("Vehicle deleted successfully!", { position: "top-center", autoClose: 3000 });
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error ||
        err.message || 'Failed to delete vehicle';
      toast.error(`Error: ${errorMessage}`, { position: "top-center", autoClose: 5000 });
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${vehicleId}`]: false }));
    }
  };

  const toggleVehicleAvailability = async (vehicleId, currentAvailability) => {
    if (!vehicleId || vehicleId === 'undefined' || vehicleId === 'null') {
      toast.error('Error: Invalid vehicle ID', { position: "top-center", autoClose: 5000 });
      return;
    }

    const action = currentAvailability ? 'make unavailable' : 'make available';
    if (!window.confirm(`Are you sure you want to ${action} this vehicle?`)) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [`toggle_${vehicleId}`]: true }));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      await axios.patch(
        API_ENDPOINTS.ADMIN.VEHICLES.TOGGLE(vehicleId), 
        {}, 
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle =>
          vehicle._id === vehicleId 
            ? { ...vehicle, isAvailable: !currentAvailability } 
            : vehicle
        )
      );
      
      toast.success(
        `Vehicle ${!currentAvailability ? 'available' : 'unavailable'} now`, 
        { position: "top-center", autoClose: 3000 }
      );
    } catch (err) {
      console.error(`Error ${action}ing vehicle:`, err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error ||
        err.message || `Failed to ${action} vehicle`;
      toast.error(`Error: ${errorMessage}`, { position: "top-center", autoClose: 5000 });
    } finally {
      setActionLoading(prev => ({ ...prev, [`toggle_${vehicleId}`]: false }));
    }
  };

  /* =========================================================
     UTILITY FUNCTIONS
  ========================================================= */

  const navigateToPaymentAnalytics = () => {
    navigate('/admin/payment-analytics');
  };

  const getTypeColor = (type) => {
    const colors = {
      sedan: '#3b82f6', suv: '#22c55e', hatchback: '#f59e0b',
      convertible: '#ef4444', truck: '#8b5cf6', van: '#6b7280', motorcycle: '#ec4899'
    };
    return colors[type.toLowerCase()] || '#6b7280';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return 'Invalid date'; }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0
    }).format(price);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Brand', 'Type', 'License Plate', 'Price Per Day', 'Price Per KM', 
       'Availability', 'Location', 'Bookings'].join(','),
      ...filteredAndSortedVehicles.map(vehicle => [
        vehicle.name, vehicle.brand, vehicle.type, vehicle.licensePlate,
        vehicle.pricePerDay, vehicle.pricePerKM,
        vehicle.isAvailable ? 'Available' : 'Unavailable',
        vehicle.location, vehicle.bookingsCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicles_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  /* =========================================================
     FILTERING & SORTING
  ========================================================= */

  const filteredAndSortedVehicles = vehicles
    .filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
      const matchesAvailability = availabilityFilter === "all" ||
        (availabilityFilter === "available" && vehicle.isAvailable) ||
        (availabilityFilter === "unavailable" && !vehicle.isAvailable);
      return matchesSearch && matchesType && matchesAvailability;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredAndSortedVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredAndSortedVehicles.length / vehiclesPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  /* =========================================================

  RENDER COMPONENTS
  ========================================================= */

  const ImageUploadSection = ({ isEdit = false }) => (
    <div className="form-section">
      <h4>Vehicle Images</h4>
      
      {/* Existing Images (Edit Mode Only) */}
      {isEdit && existingImages.length > 0 && (
        <div className="existing-images-section">
          <label>Current Images</label>
          <div className="image-preview-grid">
            {existingImages.map((imageUrl, index) => (
              <div key={`existing-${index}`} className="image-preview-item">
                <img src={imageUrl} alt={`Existing ${index + 1}`} />
                <span className="image-type-badge">Current</span>
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeExistingImage(imageUrl)}
                  title="Remove image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="image-upload-container">
        {/* Local File Upload */}
        <div className="image-upload-area">
          <input
            type="file"
            id="vehicle-images"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="vehicle-images" className="image-upload-label">
            <div className="upload-content">
              <Upload size={32} />
              <h4>Upload Vehicle Images</h4>
              <p>Click to browse or drag and drop</p>
              <small>Max 5 images total, 5MB each (JPEG, PNG, WebP)</small>
            </div>
          </label>
        </div>

        {/* New Images Preview */}
        {imagePreviewUrls.length > 0 && (
          <div className="new-images-section">
            <label>New Images ({imagePreviewUrls.length})</label>
            <div className="image-preview-grid">
              {imagePreviewUrls.map((url, index) => (
                <div key={`local-${index}`} className="image-preview-item">
                  <img src={url} alt={`New ${index + 1}`} />
                  <span className="image-type-badge">New</span>
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                    title="Remove image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="image-count-info">
          Total images: {(isEdit ? existingImages.length : 0) + selectedImages.length} / 5
        </div>
      </div>
    </div>
  );

  const VehicleFormFields = ({ formData, onChange }) => (
    <>
      <div className="form-section">
        <h4>Basic Information</h4>
        <div className="form-group">
          <label>Vehicle Name *</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g., Honda City" 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Brand *</label>
            <input 
              type="text" 
              value={formData.brand}
              onChange={(e) => onChange('brand', e.target.value)}
              placeholder="e.g., Honda" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Type *</label>
            <select 
              value={formData.type}
              onChange={(e) => onChange('type', e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="convertible">Convertible</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>License Plate *</label>
            <input 
              type="text" 
              value={formData.licensePlate}
              onChange={(e) => onChange('licensePlate', e.target.value.toUpperCase())}
              placeholder="e.g., KA01AB1234" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input 
              type="number" 
              value={formData.year}
              onChange={(e) => onChange('year', e.target.value)}
              placeholder="e.g., 2022" 
              min="1990" 
              max={new Date().getFullYear() + 1} 
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Specifications</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Capacity (seats)</label>
            <input 
              type="number" 
              value={formData.capacity}
              onChange={(e) => onChange('capacity', e.target.value)}
              placeholder="e.g., 5" 
              min="1" 
              max="50" 
            />
          </div>
          <div className="form-group">
            <label>Color</label>
            <input 
              type="text" 
              value={formData.color}
              onChange={(e) => onChange('color', e.target.value)}
              placeholder="e.g., White" 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fuel Type</label>
            <select 
              value={formData.fuelType}
              onChange={(e) => onChange('fuelType', e.target.value)}
            >
              <option value="">Select Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="cng">CNG</option>
            </select>
          </div>
          <div className="form-group">
            <label>Transmission</label>
            <select 
              value={formData.transmission}
              onChange={(e) => onChange('transmission', e.target.value)}
            >
              <option value="">Select Transmission</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="cvt">CVT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Pricing & Location</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Price per Day (₹) *</label>
            <input 
              type="number" 
              value={formData.pricePerDay}
              onChange={(e) => onChange('pricePerDay', e.target.value)}
              placeholder="e.g., 1500" 
              min="0" 
              step="50"
              required
            />
          </div>
          <div className="form-group">
            <label>Price Per KM (₹)</label>
            <input 
              type="number" 
              value={formData.pricePerKM}
              onChange={(e) => onChange('pricePerKM', e.target.value)}
              placeholder="e.g., 15" 
              min="0" 
              step="5" 
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="e.g., Bhubaneswar" 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Features (comma separated)</label>
          <textarea 
            value={formData.features}
            onChange={(e) => onChange('features', e.target.value)}
            placeholder="e.g., Air Conditioning, GPS, Bluetooth"
            rows="3" 
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={formData.isAvailable}
              onChange={(e) => onChange('isAvailable', e.target.checked)} 
            />
            <span className="checkbox-text">Vehicle is available for booking</span>
          </label>
        </div>
      </div>
    </>
  );

  /* =========================================================
     MODALS
  ========================================================= */

  const AddVehicleModal = () => (
    <div className="modal-overlay" onClick={closeAddModal}>
      <div 
        className="modal-content add-vehicle-modal" 
        onClick={(e) => e.stopPropagation()}
        ref={modalContentRef}
      >
        <div className="modal-header">
          <h3>Add New Vehicle</h3>
          <button className="modal-close-btn" onClick={closeAddModal}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <ImageUploadSection isEdit={false} />
            <VehicleFormFields formData={addFormData} onChange={handleAddInputChange} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={closeAddModal}>Cancel</button>
          <button 
            className="save-btn" 
            onClick={addVehicle}
            disabled={actionLoading['add_vehicle']}
          >
            {actionLoading['add_vehicle'] ? (
              <><RefreshCw size={16} className="spinning" />Adding...</>
            ) : (
              <><Plus size={16} />Add Vehicle</>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const EditVehicleModal = () => (
    <div className="modal-overlay" onClick={closeEditModal}>
      <div 
        className="modal-content edit-vehicle-modal" 
        onClick={(e) => e.stopPropagation()}
        ref={modalContentRef}
      >
        <div className="modal-header">
          <h3>Edit Vehicle</h3>
          <button className="modal-close-btn" onClick={closeEditModal}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <ImageUploadSection isEdit={true} />
            <VehicleFormFields formData={editFormData} onChange={handleEditInputChange} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
          <button 
            className="save-btn" 
            onClick={updateVehicle}
            disabled={actionLoading[`update_${editingVehicle?._id}`]}
          >
            {actionLoading[`update_${editingVehicle?._id}`] ? (
              <><RefreshCw size={16} className="spinning" />Updating...</>
            ) : (
              <><Check size={16} />Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const ViewVehicleModal = () => (
    <div className="modal-overlay" onClick={closeViewModal}>
      <div 
        className="modal-content view-vehicle-modal" 
        onClick={(e) => e.stopPropagation()}
        ref={modalContentRef}
      >
        <div className="modal-header">
          <h3>Vehicle Details</h3>
          <button className="modal-close-btn" onClick={closeViewModal}>
            <X size={20} />
          </button>
        </div>

        {viewingVehicle && (
          <div className="modal-body">
            <div className="vehicle-detail-section">
              {viewingVehicle.images && viewingVehicle.images.length > 0 && (
                <div className="vehicle-images-gallery">
                  {viewingVehicle.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${viewingVehicle.name} ${idx + 1}`} />
                  ))}
                </div>
              )}

              <div className="detail-grid">
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{viewingVehicle.name}</span>
                </div>
                <div className="detail-item">
                  <label>Brand:</label>
                  <span>{viewingVehicle.brand}</span>
                </div>
                <div className="detail-item">
                  <label>Type:</label>
                  <span className="type-badge" style={{ backgroundColor: getTypeColor(viewingVehicle.type) }}>
                    {viewingVehicle.type}
                  </span>
                </div>
                <div className="detail-item">
                  <label>License Plate:</label>
                  <span>{viewingVehicle.licensePlate}</span>
                </div>
                <div className="detail-item">
                  <label>Year:</label>
                  <span>{viewingVehicle.year}</span>
                </div>
                <div className="detail-item">
                  <label>Color:</label>
                  <span>{viewingVehicle.color}</span>
                </div>
                <div className="detail-item">
                  <label>Capacity:</label>
                  <span>{viewingVehicle.capacity} seats</span>
                </div>
                <div className="detail-item">
                  <label>Fuel Type:</label>
                  <span>{viewingVehicle.fuelType}</span>
                </div>
                <div className="detail-item">
                  <label>Transmission:</label>
                  <span>{viewingVehicle.transmission}</span>
                </div>
                <div className="detail-item">
                  <label>Price/Day:</label>
                  <span>{formatPrice(viewingVehicle.pricePerDay)}</span>
                </div>
                <div className="detail-item">
                  <label>Price/KM:</label>
                  <span>{formatPrice(viewingVehicle.pricePerKM)}</span>
                </div>
                <div className="detail-item">
                  <label>Location:</label>
                  <span><MapPin size={14} />{viewingVehicle.location}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`availability-badge ${viewingVehicle.isAvailable ? 'available' : 'unavailable'}`}>
                    {viewingVehicle.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Total Bookings:</label>
                  <span>{viewingVehicle.bookingsCount || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Active Bookings:</label>
                  <span>{viewingVehicle.activeBookings || 0}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Features:</label>
                  <span>{Array.isArray(viewingVehicle.features) ? viewingVehicle.features.join(', ') : viewingVehicle.features || 'None'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="secondary-btn" onClick={closeViewModal}>Close</button>
          <button className="primary-btn" onClick={() => {
            closeViewModal();
            openEditModal(viewingVehicle);
          }}>
            <Edit3 size={16} />Edit Vehicle
          </button>
        </div>
      </div>
    </div>
  );

  /* =========================================================
     MAIN RENDER
  ========================================================= */

  if (loading) {
    return (
      <div className="vehicle-list-container">
        <div className="loading-state">
          <RefreshCw className="loading-spinner" size={32} />
          <p>Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vehicle-list-container">
        <div className="error-state">
          <AlertCircle size={32} />
          <h3>Error Loading Vehicles</h3>
          <p>{error}</p>
          <button onClick={fetchVehicles} className="retry-button">
            <RefreshCw size={16} />Retry
          </button>
        </div>
      </div>
    );
  }

  const uniqueTypes = [...new Set(vehicles.map(vehicle => vehicle.type))];

  return (
    <div className="vehicle-list-container">
      <div className="vehicle-list-header">
        <div className="header-title">
          <Car size={28} />
          <div>
            <h2>Vehicle Management</h2>
            <p>{filteredAndSortedVehicles.length} total vehicles
              {selectedVehicles.length > 0 && ` (${selectedVehicles.length} selected)`}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={navigateToPaymentAnalytics} className="analytics-btn">
            <IndianRupee size={16} />Analytics
          </button>
          <button onClick={openAddModal} className="add-vehicle-btn">
            <Plus size={16} />Add Vehicle
          </button>
          <button onClick={fetchVehicles} className="refresh-btn" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button onClick={exportToCSV} className="export-btn1">
            <Download size={16} />Export
          </button>
        </div>
      </div>

      {selectedVehicles.length > 0 && (
        <div className="bulk-actions-bar">
          <span className="selection-count">{selectedVehicles.length} vehicles selected</span>
          <div className="bulk-action-buttons">
            <button 
              className="bulk-btn available"
              onClick={() => bulkToggleAvailability(true)}
              disabled={actionLoading.bulk_toggle}
            >
              {actionLoading.bulk_toggle ? <RefreshCw size={16} className="spinning" /> : <Zap size={16} />}
              Make Available
            </button>
            <button 
              className="bulk-btn unavailable"
              onClick={() => bulkToggleAvailability(false)}
              disabled={actionLoading.bulk_toggle}
            >
              {actionLoading.bulk_toggle ? <RefreshCw size={16} className="spinning" /> : <ZapOff size={16} />}
              Make Unavailable
            </button>
            <button 
              className="bulk-btn delete"
              onClick={bulkDeleteVehicles}
              disabled={actionLoading.bulk_delete}
            >
              {actionLoading.bulk_delete ? <RefreshCw size={16} className="spinning" /> : <Trash2 size={16} />}
              Delete Selected
            </button>
            <button className="bulk-btn cancel" onClick={() => {
              setSelectedVehicles([]);
              setSelectAll(false);
            }}>
              <X size={16} />Cancel
            </button>
          </div>
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input 
            type="text"
            placeholder="Search vehicles by name, brand, license plate, or location..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Settings size={16} />
            <select 
              value={availabilityFilter}
              onChange={(e) => { setAvailabilityFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="vehicles-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input 
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    title="Select all"
                  />
                </th>
                <th>Vehicle</th>
                <th 
                  onClick={() => handleSort('brand')}
                  className={`sortable ${sortField === 'brand' ? sortOrder : ''}`}
                >
                  Details
                </th>
                <th 
                  onClick={() => handleSort('type')}
                  className={`sortable ${sortField === 'type' ? sortOrder : ''}`}
                >
                  Type
                </th>
                <th 
                  onClick={() => handleSort('pricePerKM')}
                  className={`sortable ${sortField === 'pricePerKM' ? sortOrder : ''}`}
                >
                  Price/KM
                </th>
                <th>Availability</th>
                <th 
                  onClick={() => handleSort('location')}
                  className={`sortable ${sortField === 'location' ? sortOrder : ''}`}
                >
                  Location
                </th>
                <th 
                  onClick={() => handleSort('createdAt')}
                  className={`sortable ${sortField === 'createdAt' ? sortOrder : ''}`}
                >
                  Added
                </th>
                <th>Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentVehicles.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    <Car size={32} />
                    <p>No vehicles found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                currentVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className={!vehicle.isAvailable ? 'unavailable-vehicle' : ''}>
                    <td className="checkbox-cell">
                      <input 
                        type="checkbox"
                        checked={selectedVehicles.includes(vehicle._id)}
                        onChange={() => toggleSelectVehicle(vehicle._id)}
                      />
                    </td>
                    <td className="vehicle-info">
                      <div className="vehicle-image">
                        {vehicle.images && vehicle.images.length > 0 ? (
                          <img src={vehicle.images[0]} alt={vehicle.name} />
                        ) : (
                          <div className="image-placeholder"><Car size={64} /></div>
                        )}
                      </div>
                      <div className="vehicle-details">
                        <div className="vehicle-name">{vehicle.name}</div>
                        <div className="vehicle-plate">{vehicle.licensePlate}</div>
                        <div className="vehicle-id">ID: {vehicle._id.slice(-6)}</div>
                      </div>
                    </td>
                    <td className="details-info">
                      <div className="detail-item"><strong>{vehicle.brand}</strong></div>
                      <div className="detail-item"><Users size={14} /><span>{vehicle.capacity} seats</span></div>
                      <div className="detail-item"><Fuel size={14} /><span>{vehicle.fuelType}</span></div>
                      <div className="detail-item"><Settings size={14} /><span>{vehicle.transmission}</span></div>
                    </td>
                    <td>
                      <span className="type-badge" style={{ backgroundColor: getTypeColor(vehicle.type) }}>
                        {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                      </span>
                    </td>
                    <td className="price-cell">{formatPrice(vehicle.pricePerKM)}</td>
                    <td>
                      <span className={`availability-badge ${vehicle.isAvailable ? 'available' : 'unavailable'}`}>
                        {vehicle.isAvailable ? (
                          <><CheckCircle size={14} />Available</>
                        ) : (
                          <><XCircle size={14} />Unavailable</>
                        )}
                      </span>
                      {vehicle.activeBookings > 0 && (
                        <div className="active-bookings">{vehicle.activeBookings} active</div>
                      )}
                    </td>
                    <td className="location-cell">
                      <MapPin size={14} />{vehicle.location}
                    </td>
                    <td className="date-cell">
                      <Calendar size={14} />{formatDate(vehicle.createdAt)}
                    </td>
                    <td className="bookings-cell">
                      {vehicle.bookingsCount || 0}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view" 
                          title="View Details"
                          onClick={() => openViewModal(vehicle._id)}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="action-btn edit" 
                          title="Edit Vehicle" 
                          onClick={() => openEditModal(vehicle)}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className={`action-btn ${vehicle.isAvailable ? 'disable' : 'enable'}`}
                          title={vehicle.isAvailable ? 'Make Unavailable' : 'Make Available'}
                          onClick={() => toggleVehicleAvailability(vehicle._id, vehicle.isAvailable)}
                          disabled={actionLoading[`toggle_${vehicle._id}`]}
                        >
                          {actionLoading[`toggle_${vehicle._id}`] ? (
                            <RefreshCw size={14} className="spinning" />
                          ) : vehicle.isAvailable ? (
                            <ZapOff size={14} />
                          ) : (
                            <Zap size={14} />
                          )}
                        </button>
                        <button 
                          className="action-btn delete" 
                          title="Delete Vehicle"
                          onClick={() => deleteVehicle(vehicle._id)}
                          disabled={actionLoading[`delete_${vehicle._id}`] || vehicle.activeBookings > 0}
                        >
                          {actionLoading[`delete_${vehicle._id}`] ? (
                            <RefreshCw size={14} className="spinning" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1} 
            className="pagination-btn"
          >
            Previous
          </button>
          <div className="pagination-info">
            <span>Page {currentPage} of {totalPages}</span>
            <span className="separator">•</span>
            <span>{filteredAndSortedVehicles.length} vehicles</span>
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages} 
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {showAddModal && <AddVehicleModal />}
      {showEditModal && <EditVehicleModal />}
      {showViewModal && <ViewVehicleModal />}
    </div>
  );
};

export default VehicleList;