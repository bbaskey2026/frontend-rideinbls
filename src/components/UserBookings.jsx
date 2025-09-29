import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Car, 
  BookOpen, 
  CreditCard, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Upload,
  X,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import './UserBookings.css';
import API_ENDPOINTS from "../config/api";  
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({
    users: [],
    vehicles: [],
    bookings: [],
    payments: [],
    systemInfo: {}
  });
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Mock API base URL - replace with your actual API URL
  const API_BASE = 'http://localhost:5000/api/admin';

  // Get auth token from localStorage or context
  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // API Helper function
  const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      alert(`Error: ${error.message}`);
      throw error;
    }
  };

  // Load data for active tab
  const loadData = async (tab = activeTab) => {
    setLoading(true);
    try {
      let endpoint = '';
      let dataKey = '';

      switch (tab) {
        case 'users':
          endpoint = '/users';
          dataKey = 'users';
          break;
        case 'vehicles':
          endpoint = '/vehicles';
          dataKey = 'vehicles';
          break;
        case 'bookings':
          endpoint = '/bookings';
          dataKey = 'bookings';
          break;
        case 'payments':
          endpoint = '/payments';
          dataKey = 'payments';
          break;
        case 'system':
          endpoint = '/system/info';
          dataKey = 'systemInfo';
          break;
        default:
          return;
      }

      const response = await apiCall(endpoint);
      setData(prev => ({
        ...prev,
        [dataKey]: response[dataKey] || response.system || response
      }));
    } catch (error) {
      console.error(`Failed to load ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // User Management Functions
  const handleUserAction = async (action, userId, userData = null) => {
    try {
      let response;
      switch (action) {
        case 'block':
          response = await apiCall(`/users/${userId}/block`, 'PATCH');
          break;
        case 'unblock':
          response = await apiCall(`/users/${userId}/unblock`, 'PATCH');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            response = await apiCall(`/users/${userId}`, 'DELETE');
          } else return;
          break;
        case 'edit':
          response = await apiCall(`/users/${userId}`, 'PUT', userData);
          break;
        default:
          return;
      }
      
      alert(response.message || 'Action completed successfully');
      loadData('users');
      setShowModal(false);
    } catch (error) {
      console.error('User action error:', error);
    }
  };

  // Vehicle Management Functions
  const handleVehicleAction = async (action, vehicleId, vehicleData = null) => {
    try {
      let response;
      switch (action) {
        case 'create':
          const formData = new FormData();
          Object.keys(vehicleData).forEach(key => {
            if (key === 'images' && vehicleData[key]) {
              Array.from(vehicleData[key]).forEach(file => {
                formData.append('images', file);
              });
            } else {
              formData.append(key, vehicleData[key]);
            }
          });
          response = await apiCall('/vehicles', 'POST', formData, true);
          break;
        case 'edit':
          const editFormData = new FormData();
          Object.keys(vehicleData).forEach(key => {
            if (key === 'images' && vehicleData[key]) {
              Array.from(vehicleData[key]).forEach(file => {
                editFormData.append('images', file);
              });
            } else {
              editFormData.append(key, vehicleData[key]);
            }
          });
          response = await apiCall(`/vehicles/${vehicleId}`, 'PUT', editFormData, true);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this vehicle?')) {
            response = await apiCall(`/vehicles/${vehicleId}`, 'DELETE');
          } else return;
          break;
        case 'toggle-availability':
          response = await apiCall(`/vehicles/${vehicleId}/toggle-availability`, 'PATCH');
          break;
        default:
          return;
      }
      
      alert(response.message || 'Action completed successfully');
      loadData('vehicles');
      setShowModal(false);
    } catch (error) {
      console.error('Vehicle action error:', error);
    }
  };

  // Booking Management Functions
  const handleBookingAction = async (action, bookingId, status = null) => {
    try {
      if (action === 'update-status' && status) {
        const response = await apiCall(`/bookings/${bookingId}/status`, 'PUT', { status });
        alert(response.message || 'Booking status updated');
        loadData('bookings');
      }
    } catch (error) {
      console.error('Booking action error:', error);
    }
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  // Filter data based on search term
  const filterData = (items, searchFields) => {
    if (!searchTerm) return items;
    
    return items.filter(item =>
      searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  // Render Users Tab
  const renderUsersTab = () => {
    const filteredUsers = filterData(data.users, ['name', 'email', 'phone']);
    
    return (
      <div className="form-grid">
        <div className="section-header">
          <h3 className="section-title">User Management</h3>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={() => loadData('users')}
              className="btn btn-secondary"
            >
              <RefreshCw />
              Refresh
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td>{user.bookingsCount || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openModal('edit-user', user)}
                        className="action-btn edit"
                        title="Edit"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.isActive ? 'block' : 'unblock', user._id)}
                        className="action-btn toggle"
                        title={user.isActive ? 'Block' : 'Unblock'}
                      >
                        {user.isActive ? <Ban /> : <CheckCircle />}
                      </button>
                      <button
                        onClick={() => handleUserAction('delete', user._id)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Vehicles Tab
  const renderVehiclesTab = () => {
    const filteredVehicles = filterData(data.vehicles, ['name', 'brand', 'type', 'licensePlate']);
    
    return (
      <div className="form-grid">
        <div className="section-header">
          <h3 className="section-title">Vehicle Management</h3>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={() => openModal('add-vehicle')}
              className="btn btn-primary"
            >
              <Plus />
              Add Vehicle
            </button>
            <button
              onClick={() => loadData('vehicles')}
              className="btn btn-secondary"
            >
              <RefreshCw />
              Refresh
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Type</th>
                <th>License Plate</th>
                <th>Capacity</th>
                <th>Price/Day</th>
                <th>Status</th>
                <th>Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle._id}>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.licensePlate}</td>
                  <td>{vehicle.capacity}</td>
                  <td>₹{vehicle.pricePerDay}</td>
                  <td>
                    <span className={`status-badge ${vehicle.isAvailable ? 'available' : 'unavailable'}`}>
                      {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>{vehicle.bookingsCount || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openModal('edit-vehicle', vehicle)}
                        className="action-btn edit"
                        title="Edit"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleVehicleAction('toggle-availability', vehicle._id)}
                        className="action-btn toggle"
                        title={vehicle.isAvailable ? 'Make Unavailable' : 'Make Available'}
                      >
                        {vehicle.isAvailable ? <Ban /> : <CheckCircle />}
                      </button>
                      <button
                        onClick={() => handleVehicleAction('delete', vehicle._id)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Bookings Tab
  const renderBookingsTab = () => {
    const filteredBookings = filterData(data.bookings, ['bookingCode', 'user.name', 'vehicle.name']);
    
    return (
      <div className="form-grid">
        <div className="section-header">
          <h3 className="section-title">Booking Management</h3>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={() => loadData('bookings')}
              className="btn btn-secondary"
            >
              <RefreshCw />
              Refresh
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking Code</th>
                <th>User</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.bookingCode}</td>
                  <td>{booking.user?.name}</td>
                  <td>{booking.vehicle?.name}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => handleBookingAction('update-status', booking._id, e.target.value)}
                      className="form-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>₹{booking.payment?.amount || 0}</td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => openModal('view-booking', booking)}
                      className="action-btn view"
                      title="View Details"
                    >
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Payments Tab
  const renderPaymentsTab = () => {
    const filteredPayments = filterData(data.payments, ['bookingCode', 'user.name', 'vehicle.name']);
    
    return (
      <div className="form-grid">
        <div className="section-header">
          <h3 className="section-title">Payment Management</h3>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={() => loadData('payments')}
              className="btn btn-secondary"
            >
              <RefreshCw />
              Refresh
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking Code</th>
                <th>User</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.bookingCode}>
                  <td>{payment.bookingCode}</td>
                  <td>{payment.user?.name}</td>
                  <td>{payment.vehicle?.name}</td>
                  <td>₹{payment.amountPaid}</td>
                  <td>
                    <span className={`status-badge ${payment.paymentStatus === 'Success' ? 'success' : 'pending'}`}>
                      {payment.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render System Info Tab
  const renderSystemTab = () => {
    const { system } = data.systemInfo;
    if (!system) return <div>Loading system information...</div>;

    return (
      <div className="form-grid">
        <div className="section-header">
          <h3 className="section-title">System Information</h3>
          <button
            onClick={() => loadData('system')}
            className="btn btn-secondary"
          >
            <RefreshCw />
            Refresh
          </button>
        </div>

        <div className="system-grid">
          <div className="system-card users">
            <h4 className="card-title">Users</h4>
            <div className="card-stats">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{system.users?.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active:</span>
                <span className="stat-value success">{system.users?.active || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Inactive:</span>
                <span className="stat-value error">{system.users?.inactive || 0}</span>
              </div>
            </div>
          </div>

          <div className="system-card vehicles">
            <h4 className="card-title">Vehicles</h4>
            <div className="card-stats">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{system.vehicles?.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Available:</span>
                <span className="stat-value success">{system.vehicles?.available || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Unavailable:</span>
                <span className="stat-value error">{system.vehicles?.unavailable || 0}</span>
              </div>
            </div>
          </div>

          <div className="system-card bookings">
            <h4 className="card-title">Bookings</h4>
            <div className="card-stats">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{system.bookings?.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pending:</span>
                <span className="stat-value">{system.bookings?.pending || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed:</span>
                <span className="stat-value success">{system.bookings?.completed || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="system-details">
          <h4 className="details-title">System Details</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Environment:</span>
              <span className="detail-value">{system.environment}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Storage Type:</span>
              <span className="detail-value">{system.storage?.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Updated:</span>
              <span className="detail-value">{new Date(system.timestamp).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Storage Configured:</span>
              <span className={`detail-value ${system.storage?.configured ? 'success' : 'error'}`}>
                {system.storage?.configured ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal Component
  const renderModal = () => {
    if (!showModal) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        switch (modalType) {
          case 'edit-user':
            await handleUserAction('edit', selectedItem._id, data);
            break;
          case 'add-vehicle':
            await handleVehicleAction('create', null, data);
            break;
          case 'edit-vehicle':
            await handleVehicleAction('edit', selectedItem._id, data);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Modal form error:', error);
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {modalType === 'edit-user' && 'Edit User'}
              {modalType === 'add-vehicle' && 'Add Vehicle'}
              {modalType === 'edit-vehicle' && 'Edit Vehicle'}
              {modalType === 'view-booking' && 'Booking Details'}
            </h2>
            <button onClick={closeModal} className="modal-close">
              <X />
            </button>
          </div>

          <div className="modal-body">
            {modalType === 'view-booking' ? (
              <div className="form-grid">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Booking Code</label>
                    <p>{selectedItem?.bookingCode}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <p>{selectedItem?.status}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">User</label>
                    <p>{selectedItem?.user?.name} ({selectedItem?.user?.email})</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vehicle</label>
                    <p>{selectedItem?.vehicle?.name} - {selectedItem?.vehicle?.licensePlate}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount</label>
                    <p>₹{selectedItem?.payment?.amount || 0}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <p>{new Date(selectedItem?.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-grid">
                {(modalType === 'edit-user') && (
                  <>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={selectedItem?.name}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={selectedItem?.email}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        defaultValue={selectedItem?.phone}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="role" className="form-label">Role</label>
                      <select
                        id="role"
                        name="role"
                        defaultValue={selectedItem?.role}
                        className="form-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </>
                )}

                {(modalType === 'add-vehicle' || modalType === 'edit-vehicle') && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Vehicle Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          defaultValue={selectedItem?.name}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="brand" className="form-label">Brand</label>
                        <input
                          type="text"
                          id="brand"
                          name="brand"
                          defaultValue={selectedItem?.brand}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="type" className="form-label">Type</label>
                        <select
                          id="type"
                          name="type"
                          defaultValue={selectedItem?.type}
                          className="form-select"
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Bike">Bike</option>
                          <option value="Convertible">Convertible</option>
                          <option value="Truck">Truck</option>
                          <option value="Van">Van</option>
                          <option value="Coupe">Coupe</option>
                          <option value="Wagon">Wagon</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="licensePlate" className="form-label">License Plate</label>
                        <input
                          type="text"
                          id="licensePlate"
                          name="licensePlate"
                          defaultValue={selectedItem?.licensePlate}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="capacity" className="form-label">Capacity</label>
                        <input
                          type="number"
                          id="capacity"
                          name="capacity"
                          min="1"
                          defaultValue={selectedItem?.capacity}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pricePerDay" className="form-label">Price per Day (₹)</label>
                        <input
                          type="number"
                          id="pricePerDay"
                          name="pricePerDay"
                          min="0"
                          step="0.01"
                          defaultValue={selectedItem?.pricePerDay}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        defaultValue={selectedItem?.location}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="features" className="form-label">Features (comma-separated)</label>
                      <textarea
                        id="features"
                        name="features"
                        defaultValue={selectedItem?.features?.join(', ')}
                        rows={3}
                        className="form-textarea"
                        placeholder="AC, GPS, Bluetooth, etc."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="images" className="form-label">Images (max 5)</label>
                      <input
                        type="file"
                        id="images"
                        name="images"
                        multiple
                        accept="image/*"
                        className="form-input"
                      />
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        Select up to 5 images (JPEG, PNG, WebP, GIF)
                      </p>
                    </div>

                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        name="isAvailable"
                        defaultChecked={selectedItem?.isAvailable !== false}
                      />
                      <label htmlFor="isAvailable" className="form-label">Available for booking</label>
                    </div>
                  </>
                )}

                {modalType !== 'view-booking' && (
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-save"
                    >
                      {modalType === 'add-vehicle' ? 'Add Vehicle' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="header-title">Admin Dashboard</h1>
            <div className="header-info">
              Welcome, Admin | {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <nav className="tab-nav-list">
            {[
              { id: 'users', name: 'Users', icon: Users },
              { id: 'vehicles', name: 'Vehicles', icon: Car },
              { id: 'bookings', name: 'Bookings', icon: BookOpen },
              { id: 'payments', name: 'Payments', icon: CreditCard },
              { id: 'system', name: 'System', icon: Settings },
            ].map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setSearchTerm('');
                }}
                className={`tab-button ${activeTab === id ? 'active' : ''}`}
              >
                <Icon />
                {name}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading...</span>
          </div>
        )}

        {/* Tab Content */}
        {!loading && (
          <div className="content-container">
            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'vehicles' && renderVehiclesTab()}
            {activeTab === 'bookings' && renderBookingsTab()}
            {activeTab === 'payments' && renderPaymentsTab()}
            {activeTab === 'system' && renderSystemTab()}
          </div>
        )}
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default AdminDashboard;