import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Plus,
  X,
  Save,
  IdCard
} from "lucide-react";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../config/api";
import "./DriverManagement.css";

function DriverManagement() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    
    // Address
    street: "",
    city: "",
    state: "",
    pincode: "",
    
    // License Information
    licenseNumber: "",
    licenseType: "Light Motor Vehicle",
    licenseExpiry: "",
    licenseIssueDate: "",
    
    // Experience
    yearsOfExperience: 0,
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactMobile: "",
    
    // Additional
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const {
      name,
      email,
      mobile,
      dateOfBirth,
      licenseNumber,
      licenseType,
      licenseExpiry,
      licenseIssueDate,
    } = formData;

    if (!name || !email || !mobile || !dateOfBirth) {
      toast.error("Please fill all personal information fields", { position: "top-center" });
      return false;
    }

    if (!licenseNumber || !licenseType || !licenseExpiry || !licenseIssueDate) {
      toast.error("Please fill all license information fields", { position: "top-center" });
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", { position: "top-center" });
      return false;
    }

    // Validate mobile
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error("Mobile number must be 10 digits", { position: "top-center" });
      return false;
    }

    // Validate pincode if provided
    if (formData.pincode) {
      const pincodeRegex = /^[0-9]{6}$/;
      if (!pincodeRegex.test(formData.pincode)) {
        toast.error("Pincode must be 6 digits", { position: "top-center" });
        return false;
      }
    }

    // Validate emergency contact mobile if provided
    if (formData.emergencyContactMobile && !mobileRegex.test(formData.emergencyContactMobile)) {
      toast.error("Emergency contact mobile must be 10 digits", { position: "top-center" });
      return false;
    }

    // Validate license expiry (should be in future)
    if (new Date(licenseExpiry) < new Date()) {
      toast.error("License has expired. Please provide a valid license", { position: "top-center" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        dateOfBirth: formData.dateOfBirth,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        licenseNumber: formData.licenseNumber,
        licenseType: formData.licenseType,
        licenseExpiry: formData.licenseExpiry,
        licenseIssueDate: formData.licenseIssueDate,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        emergencyContact: {
          name: formData.emergencyContactName,
          relation: formData.emergencyContactRelation,
          mobile: formData.emergencyContactMobile,
        },
        notes: formData.notes,
      };

      const response = await fetch(API_ENDPOINTS.DRIVERS.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Driver created successfully!", { position: "top-center" });
        resetForm();
        setShowForm(false);
      } else {
        toast.error(result.message || "Failed to create driver", { position: "top-center" });
      }
    } catch (err) {
      console.error("Create driver error:", err);
      toast.error("Network error. Please try again.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      dateOfBirth: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      licenseNumber: "",
      licenseType: "Light Motor Vehicle",
      licenseExpiry: "",
      licenseIssueDate: "",
      yearsOfExperience: 0,
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactMobile: "",
      notes: "",
    });
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="driver-management-container">
      <div className="driver-header">
        <div>
          <h1 className="driver-title">DRIVER MANAGEMENT</h1>
          <p className="driver-subtitle">Create and manage driver profiles</p>
        </div>
        {!showForm && (
          <button className="add-driver-btn" onClick={() => setShowForm(true)}>
            <Plus size={20} />
            Add New Driver
          </button>
        )}
      </div>

      {showForm && (
        <div className="driver-form-card">
          <div className="form-header">
            <h2>CREATE NEW DRIVER</h2>
            <button className="close-btn" onClick={handleCancel}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="form-section">
              <h3 className="section-title">
                <User size={18} />
                PERSONAL INFORMATION
              </h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="driver@example.com"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="form-section">
              <h3 className="section-title">
                <MapPin size={18} />
                ADDRESS
              </h3>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="House number, street name"
                  />
                </div>
                <div className="form-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-field">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                <div className="form-field">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    pattern="[0-9]{6}"
                    maxLength="6"
                  />
                </div>
              </div>
            </div>

            {/* License Information */}
            <div className="form-section">
              <h3 className="section-title">
                <IdCard size={18} />
                LICENSE INFORMATION
              </h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>License Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="DL1234567890"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>License Type *</label>
                  <select
                    name="licenseType"
                    value={formData.licenseType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Light Motor Vehicle">Light Motor Vehicle</option>
                    <option value="Heavy Motor Vehicle">Heavy Motor Vehicle</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>License Issue Date *</label>
                  <input
                    type="date"
                    name="licenseIssueDate"
                    value={formData.licenseIssueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>License Expiry Date *</label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="form-section">
              <h3 className="section-title">
                <Phone size={18} />
                EMERGENCY CONTACT
              </h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="form-field">
                  <label>Relationship</label>
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    placeholder="e.g., Spouse, Parent"
                  />
                </div>
                <div className="form-field">
                  <label>Contact Mobile</label>
                  <input
                    type="tel"
                    name="emergencyContactMobile"
                    value={formData.emergencyContactMobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    pattern="[0-9]{10}"
                    maxLength="10"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="form-section">
              <h3 className="section-title">
                <FileText size={18} />
                ADDITIONAL NOTES
              </h3>
              <div className="form-field full-width">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information about the driver..."
                  rows="4"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                <Save size={18} />
                {loading ? "Creating..." : "Create Driver"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DriverManagement;