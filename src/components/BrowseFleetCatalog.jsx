import React, { useState } from "react";
import {
  Users,
  Fuel,
  Car,
  MapPin,
  Star,
} from "lucide-react";
import "./BrowseFleetCatalog.css";

const BrowseFleetCatalog = ({ vehicles, onBook }) => {
  const [activeType, setActiveType] = useState("All");
  const [imageIndexes, setImageIndexes] = useState({});

  // Filter vehicles by type
  const filteredVehicles =
    activeType === "All"
      ? vehicles
      : vehicles.filter((v) => v.type === activeType);

  // Image slider handler
  const slideImage = (vehicleId, direction) => {
    setImageIndexes((prev) => {
      const total = vehicles.find((v) => v._id === vehicleId)?.images?.length || 0;
      const current = prev[vehicleId] || 0;
      let newIndex = direction === "next" ? current + 1 : current - 1;
      if (newIndex < 0) newIndex = total - 1;
      if (newIndex >= total) newIndex = 0;
      return { ...prev, [vehicleId]: newIndex };
    });
  };

  // Render star ratings
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? "star-filled" : "star-empty"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="catalog-container">
      {/* Header */}
      <div className="catalog-header">
        <h2>🚘 Browse Fleet Catalog</h2>
        <p>Choose from our wide range of vehicles for your journey</p>
      </div>

      {/* Filters */}
      <div className="type-switcher">
        {["All", "Sedan", "SUV", "Bike", "Convertible", "Truck", "Van"].map(
          (type) => (
            <button
              key={type}
              className={`type-button ${activeType === type ? "active" : ""}`}
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* Vehicle Grid */}
      <div className="vehicle-grid">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((v) => {
            const currentImageIndex = imageIndexes[v._id] || 0;
            return (
              <div
                key={v._id}
                className={`vehicle-card ${v.isBooked ? "booked" : ""}`}
              >
                {/* Image Slider */}
                <div className="vehicle-image-slider">
                  {v.images && v.images.length > 0 ? (
                    <div className="slider-container">
                      {v.images.map((img, idx) => (
                        <img
                          key={`${v._id}-img-${idx}`}
                          src={img}
                          alt={`${v.name}-${idx + 1}`}
                          className="slider-image"
                          style={{
                            display: idx === currentImageIndex ? "block" : "none",
                          }}
                        />
                      ))}
                      {v.images.length > 1 && (
                        <div className="slider-controls">
                          <button
                            className="prev-btn"
                            onClick={() => slideImage(v._id, "prev")}
                          >
                            &#10094;
                          </button>
                          <button
                            className="next-btn"
                            onClick={() => slideImage(v._id, "next")}
                          >
                            &#10095;
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={`https://source.unsplash.com/400x250/?car,${v.type}`}
                      alt={v.name}
                    />
                  )}
                </div>

                {/* Vehicle Info */}
                <h3>
                  {v.name} ({v.brand})
                </h3>
                {v.rating && (
                  <div className="rating-section">
                    {renderStars(v.rating)} ({v.totalReviews || 0})
                  </div>
                )}

                <div className="vehicle-info-grid">
                  <div>
                    <Users size={16} /> {v.seats} Seats
                  </div>
                  <div>
                    <Fuel size={16} /> {v.mileage} kmpl
                  </div>
                  <div>
                    <MapPin size={16} /> {v.location || "N/A"}
                  </div>
                  <div>
                    <Car size={16} /> {v.type}
                  </div>
                </div>

                {/* Footer */}
                <div className="vehicle-footer">
                  <span>₹{v.price}/day</span>
                  {v.isBooked ? (
                    <button disabled>Not Available</button>
                  ) : (
                    <button onClick={() => onBook(v)}>Book Now</button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-vehicles">
            <p>No vehicles found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseFleetCatalog;
