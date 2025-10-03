import React, { useState } from "react";
import { MapPin } from "lucide-react";
import ServiceExpansionRequest from "./ServiceExpansionRequest";
import "./Cities.css";

const citiesData = [
  { 
    id: 1, 
    name: "Balasore", 
    vehicles: 150, 
    service: "24/7 operations",
  },
  { 
    id: 2, 
    name: "Baripada", 
    vehicles: 120, 
    service: "Express service",
  },
  { 
    id: 3, 
    name: "Bhadrak", 
    vehicles: 100, 
    service: "Medical priority",
  },
  { 
    id: 4, 
    name: "Jaleswar", 
    vehicles: 80, 
    service: "Local expertise",
  },
  { 
    id: 5, 
    name: "Cuttack", 
    vehicles: 200, 
    service: "Metro service",
  },
  { 
    id: 6, 
    name: "Bhubaneswar", 
    vehicles: 300, 
    service: "Airport connectivity",
  },
];

function Cities() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="cities" className="cities-section">
        <div className="section-header">
          <h2>Our Service Cities Across Odisha</h2>
          <p>Reliable and scalable vehicle operations for your convenience</p>
        </div>

        <div className="cities-grid">
          {citiesData.map((city) => (
            <div key={city.id} className="city-card">
              <div className="city-icon-wrapper">
                <MapPin size={48} strokeWidth={2} />
              </div>
              <h3>{city.name}</h3>
              <p><strong>{city.vehicles}+</strong> active vehicles</p>
              <p>{city.service}</p>
            </div>
          ))}
        </div>

        <div className="cities-note">
          <p>
            Expand your city with us!{" "}
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="cities-link-btn"
            >
              Request Service Expansion
            </button>
          </p>
        </div>
      </section>

      <ServiceExpansionRequest 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

export default Cities;