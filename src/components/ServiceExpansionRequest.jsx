import React, { useState } from "react";
import { MapPin, User, Mail, Phone, MessageSquare, X, Send } from "lucide-react";
import { toast } from "react-toastify";
import "./ServiceExpansionRequest.css";

function ServiceExpansionRequest({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    cityName: "",
    state: "Odisha",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, mobile, cityName } = formData;

    if (!name || !email || !mobile || !cityName) {
      toast.error("Please fill all required fields", { position: "top-center" });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", { position: "top-center" });
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error("Mobile number must be 10 digits", { position: "top-center" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      // const response = await fetch("/api/service-expansion/request", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Request submitted successfully! We'll contact you soon.", {
        position: "top-center",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        cityName: "",
        state: "Odisha",
        message: "",
      });

      onClose();
    } catch (err) {
      toast.error("Failed to submit request. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="expansion-modal-overlay" onClick={onClose}>
      <div className="expansion-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="expansion-modal-header">
          <h2>Request Service Expansion</h2>
          <button className="expansion-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="expansion-modal-body">
          <p className="expansion-intro">
            Want RideInBls services in your city? Fill out the form below and we'll
            evaluate expanding to your location.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="expansion-form-field">
              <label>
                <User size={16} />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="expansion-form-field">
              <label>
                <Mail size={16} />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="expansion-form-field">
              <label>
                <Phone size={16} />
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>

            <div className="expansion-form-row">
              <div className="expansion-form-field">
                <label>
                  <MapPin size={16} />
                  City Name *
                </label>
                <input
                  type="text"
                  name="cityName"
                  value={formData.cityName}
                  onChange={handleChange}
                  placeholder="Enter city name"
                  required
                />
              </div>

              <div className="expansion-form-field">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="expansion-form-field">
              <label>
                <MessageSquare size={16} />
                Additional Information
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us why you need our service in your city..."
                rows="4"
              />
            </div>

            <div className="expansion-form-actions">
              <button
                type="button"
                className="expansion-cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="expansion-submit-btn"
                disabled={loading}
              >
                <Send size={18} />
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ServiceExpansionRequest;