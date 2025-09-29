import React, { useState } from "react";
import { MapPin, Navigation, Shuffle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingPage.css";
import API_ENDPOINTS from "../config/api";

export default function BookingPage() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'source' or 'destination'

  const navigate = useNavigate();

  // Fetch autocomplete results from backend
  const fetchSuggestions = async (query, type) => {
    if (!query) {
      setSuggestions([]);
      setShowModal(false);
      return;
    }
    try {
      const res = await axios.get(`${API_ENDPOINTS.GOOGLE.AUTOCOMPLETE}?input=${query}`);
      const predictions = res.data.predictions || [];
      setSuggestions(predictions);
      setActiveField(type);
      setShowModal(predictions.length > 0);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestions([]);
      setShowModal(false);
    }
  };

  const handleSelectPlace = async (place) => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.GOOGLE.DETAILS}?place_id=${place.place_id}`);
      const formatted = res.data.result.formatted_address;
      
      if (activeField === "source") {
        setSource(formatted);
      } else {
        setDestination(formatted);
      }
      
      setSuggestions([]);
      setShowModal(false);
      setActiveField(null);
    } catch (err) {
      console.error("Details error:", err);
    }
  };

  const handleFindVehicles = () => {
    if (!source || !destination) {
      alert("Please select both pickup and drop locations!");
      return;
    }
    navigate(
      `/finding-vehicles?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`
    );
  };

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  const closeModal = () => {
    setShowModal(false);
    setSuggestions([]);
    setActiveField(null);
  };

  return (
    <div className="booking-page">
      {/* Left Side */}
      <div className="booking-left">
        <img
          src="/images/booking-side.png"
          alt="Book Ride"
          className="booking-image"
        />
        <h1 className="booking-title">Plan Your Journey</h1>
        <p className="booking-text">
          With <strong>BLS Ride</strong>, booking your next ride is simple,
          fast, and reliable. Choose your pickup and drop locations, and find
          the best vehicles tailored for your travel.
        </p>
      </div>

      {/* Right Side */}
      <div className="booking-right">
        <div className="booking-form">
          <h2 className="booking-form-title">Book Your Ride</h2>

          {/* Source */}
          <div className="input-group">
            <MapPin size={22} className="icon" />
            <input
              type="text"
              placeholder="Enter Pickup Location"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                fetchSuggestions(e.target.value, "source");
              }}
              className="booking-input"
            />
          </div>

          {/* Swap Button */}
          <button
            type="button"
            className="swap-button"
            onClick={handleSwap}
            title="Swap Source & Destination"
          >
            <Shuffle size={20} />
          </button>

          {/* Destination */}
          <div className="input-group">
            <Navigation size={22} className="icon" />
            <input
              type="text"
              placeholder="Enter Drop Location"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                fetchSuggestions(e.target.value, "destination");
              }}
              className="booking-input"
            />
          </div>

          <button className="booking-button" onClick={handleFindVehicles}>
            Find Vehicles
          </button>
        </div>
      </div>

      {/* Suggestions Modal */}
      {showModal && (
        <div className="suggestions-modal-overlay" onClick={closeModal}>
          <div className="suggestions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="suggestions-modal-header">
              <h3>
                {activeField === "source" ? "Select Pickup Location" : "Select Drop Location"}
              </h3>
              <button className="suggestions-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="suggestions-modal-body">
              {suggestions.length === 0 ? (
                <p className="no-suggestions">No locations found</p>
              ) : (
                <ul className="suggestions-modal-list">
                  {suggestions.map((s) => (
                    <li
                      key={s.place_id}
                      className="suggestion-item"
                      onClick={() => handleSelectPlace(s)}
                    >
                      <MapPin size={18} className="suggestion-icon" />
                      <div className="suggestion-text">
                        <div className="suggestion-main">{s.structured_formatting?.main_text || s.description}</div>
                        <div className="suggestion-secondary">{s.structured_formatting?.secondary_text || ""}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}