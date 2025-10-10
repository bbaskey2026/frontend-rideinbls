import React from "react";
import "./Partner.css";

// Import images
import driverImage from "../assets/vu.png";
import fleetImage from "../assets/partner.png";

export default function BecomePartner() {
  return (
    <section className="partner-section">
      <div className="partner-header">
        <h2>Become a Partner with RideInBls</h2>
        <p>
          Join our growing network of drivers and fleet owners. Earn more, get flexible working hours, and be part of a trusted transportation platform across Odisha.
        </p>
      </div>

      {/* Section 1: For Individual Drivers */}
      <div className="partner-row">
        <div className="partner-text">
          <h3>Drive with BlsRide</h3>
          <p>
            Own a car or bike? Earn on your schedule with BlsRide. Our platform ensures timely payments, safety features, and 24/7 support for our drivers. Get started easily and grow your earnings.
          </p>
          <button onClick={() => window.location.href="/driver-signup"} className="partner-btn">
            Join as Driver
          </button>
        </div>
        <div className="partner-image">
          <img src={driverImage} alt="Drive with BlsRide" />
        </div>
      </div>

      {/* Section 2: For Fleet Owners */}
      <div className="partner-row reverse">
        <div className="partner-text">
          <h3>Partner as Fleet Owner</h3>
          <p>
            Expand your fleet business by joining BlsRide. Get access to real-time ride requests, automated trip management, and reliable payouts. Partner with a trusted mobility platform today.
          </p>
          <button onClick={() => window.location.href="/fleet-signup"} className="partner-btn">
            Join as Fleet Owner
          </button>
        </div>
        <div className="partner-image">
          <img src={fleetImage} alt="Fleet Partnership" />
        </div>
      </div>
    </section>
  );
}