import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X } from "lucide-react";
import API_ENDPOINTS from "../config/api";
import BrandLoader from "./BrandLoader";
import "./UserProfile.css";

function UserProfile() {
  const { user, token, setUserAndToken } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userData, setUserData] = useState(null);
  const [statistics, setStatistics] = useState({
    totalBookings: 0,
    activeTrips: 0,
    completedTrips: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // Fetch user details on mount
  useEffect(() => {
    fetchUserDetails();
  }, [token]);

  const fetchUserDetails = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUserData(result.data.user);
        setFormData({
          name: result.data.user.name || "",
          email: result.data.user.email || "",
          mobile: result.data.user.mobile || "",
        });
        
        // Set statistics from API response
        if (result.data.user.statistics) {
          setStatistics({
            totalBookings: result.data.user.statistics.totalBookings || 0,
            activeTrips: result.data.user.statistics.activeTrips || 0,
            completedTrips: result.data.user.statistics.completedTrips || 0,
          });
        }
      } else {
        setMessage({ 
          type: "error", 
          text: result.message || "Failed to fetch user details" 
        });
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setMessage({ 
        type: "error", 
        text: "Unable to connect to server" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: "", text: "" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      mobile: userData?.mobile || "",
    });
    setMessage({ type: "", text: "" });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserAndToken(data.user, token);
        setUserData(data.user);
        setIsEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        
        // Refetch to update statistics
        await fetchUserDetails();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({ 
          type: "error", 
          text: data.message || "Failed to update profile" 
        });
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: "Network error. Please try again." 
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <BrandLoader 
          name="RideInBls" 
          caption="Loading profile..." 
          overlay 
          textColor="#fff" 
          size="60px" 
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="empty-profile">
            <User size={64} color="#cccccc" />
            <p>Unable to load profile. Please try again.</p>
            <button className="action-button save" onClick={fetchUserDetails}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{userData.name || "User"}</h1>
            <p className="profile-role">
              <Shield size={16} />
              {userData.role === "admin" ? "Administrator" : "User"}
            </p>
          </div>
          {!isEditing && (
            <button className="edit-button" onClick={handleEdit}>
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Profile Details */}
        <div className="profile-body">
          <div className="profile-section">
            <h2 className="section-title">PERSONAL INFORMATION</h2>

            <div className="info-grid">
              {/* Name */}
              <div className="info-item">
                <label className="info-label">
                  <User size={16} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="info-input"
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="info-value">{userData.name || "N/A"}</div>
                )}
              </div>

              {/* Email */}
              <div className="info-item">
                <label className="info-label">
                  <Mail size={16} />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="info-input"
                    placeholder="Enter your email"
                    disabled
                  />
                ) : (
                  <div className="info-value">{userData.email || "N/A"}</div>
                )}
              </div>

              {/* Mobile */}
              <div className="info-item">
                <label className="info-label">
                  <Phone size={16} />
                  Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="info-input"
                    placeholder="Enter your mobile number"
                    pattern="[0-9]{10}"
                  />
                ) : (
                  <div className="info-value">{userData.mobile || "Not provided"}</div>
                )}
              </div>

              {/* Member Since */}
              <div className="info-item">
                <label className="info-label">
                  <Calendar size={16} />
                  Member Since
                </label>
                <div className="info-value">{formatDate(userData.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="profile-section">
            <h2 className="section-title">ACCOUNT STATISTICS</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{statistics.totalBookings}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{statistics.activeTrips}</div>
                <div className="stat-label">Active Trips</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{statistics.completedTrips}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="profile-actions">
              <button
                className="action-button save"
                onClick={handleSave}
                disabled={saveLoading}
              >
                <Save size={18} />
                {saveLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="action-button cancel"
                onClick={handleCancel}
                disabled={saveLoading}
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;