import React from "react";
import {


    Calendar ,
  MapPin, Car, Users, Shield, Globe, Star, FileText,
  Clock, Phone, CreditCard, Award, Zap, Heart,
  TrendingUp, CheckCircle, ArrowRight, Menu, X, User, LogOut,
  Contact
} from "lucide-react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import BrandLoader from "./BrandLoader";
import Reviews from "./Reviews";
import Cities from "./Cities";
import Policies from "./Policies";
import Partner from "./Partner";
import ContactSection from "./ContactSection";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { user, token, logout, loading } = React.useContext(AuthContext);


  const UserBookings=()=>{
navigate("/admin/userbookings")
  }
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle navigation with React Router
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Handle scroll to section
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (

      <BrandLoader
        name="RideInBls"
        caption="Loading Please wait..."
        overlay={true}       // transparent overlay
        textColor="#111"
        size="60px"
      />

    );
  }

  // Render navigation for logged out users
  const renderGuestNavigation = () => (
    <div className="nav-links">
      <button onClick={() => handleScrollToSection("services")} className="nav-link-btn">Services</button>
      <button onClick={() => handleScrollToSection("why-us")} className="nav-link-btn">Why Us</button>
      <button onClick={() => handleScrollToSection("cities")} className="nav-link-btn">Cities</button>
      <button onClick={() => handleScrollToSection("reviews")} className="nav-link-btn">Reviews</button>
      <button onClick={() => handleScrollToSection("policies")} className="nav-link-btn">Policies</button>
      <button onClick={() => handleNavigation("/login")} className="nav-link-btn">Login</button>
      <button onClick={() => handleNavigation("/register")} className="nav-link-btn register-link">Register</button>
    </div>
  );

  // Render navigation for normal logged in users
  const renderUserNavigation = () => (
    <div className="nav-links">
      <button onClick={() => handleNavigation("/dashboard")} className="nav-link-btn">Dashboard</button>
      <button onClick={() => handleNavigation("/profile")} className="nav-link-btn">Profile</button>
      <div className="user-menu">
        <User size={20} />
        <span>Hello, {user?.name || "User"}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );

  // Render navigation for admins
  const renderAdminNavigation = () => (
    <div className="nav-links">
      <button onClick={() => handleNavigation("/admin/users")} className="nav-link-btn">Admin Panel</button>
      <button onClick={() => handleNavigation("/admin/vehicles")} className="nav-link-btn">Manage Vehicles</button>
      <button onClick={() => handleNavigation("/admin/users")} className="nav-link-btn">Manage Users</button>
      <div className="user-menu">
        <User size={20} />
        <span>Hello, {user?.name || "Admin"}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );

  // Render mobile menu for guests
  const renderGuestMobileMenu = () => (
    <div className="mobile-menu">
      <button onClick={() => handleScrollToSection("services")} className="mobile-nav-btn">Services</button>
      <button onClick={() => handleScrollToSection("why-us")} className="mobile-nav-btn">Why Us</button>
      <button onClick={() => handleScrollToSection("cities")} className="mobile-nav-btn">Cities</button>
      <button onClick={() => handleScrollToSection("reviews")} className="mobile-nav-btn">Reviews</button>
      <button onClick={() => handleScrollToSection("policies")} className="mobile-nav-btn">Policies</button>
      <button onClick={() => handleNavigation("/login")} className="mobile-nav-btn">Login</button>
      <button onClick={() => handleNavigation("/register")} className="mobile-nav-btn">Register</button>
    </div>
  );

  // Render mobile menu for normal users
  const renderUserMobileMenu = () => (
    <div className="mobile-menu">
      <button onClick={() => handleNavigation("/dashboard")} className="mobile-nav-btn">Dashboard</button>
      <button onClick={() => handleNavigation("/profile")} className="mobile-nav-btn">Profile</button>
      <div className="mobile-user-info">
        <span>Hello, {user?.name || "User"}</span>
        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-logout-btn">
          Logout
        </button>
      </div>
    </div>
  );

  // Render mobile menu for admins
  const renderAdminMobileMenu = () => (
    <div className="mobile-menu">
      <button onClick={() => handleNavigation("/admin/users")} className="mobile-nav-btn">Admin Panel</button>
      <button onClick={() => handleNavigation("/admin/vehicles")} className="mobile-nav-btn">Manage Vehicles</button>
      <button onClick={() => handleNavigation("/admin/users")} className="mobile-nav-btn">Manage Users</button>
      <div className="mobile-user-info">
        <span>Hello, {user?.name || "Admin"}</span>
        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-logout-btn">
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="landing-container">
      




     {/* Hero Section */}
<section className="hero-section">



   
  {/* Left Side - Vehicle Image */}
  <div className="hero-image">
    <img
      src="./src/assets/hero.png" // <-- replace with your actual image path
      alt="Vehicles Fleet"
    />
  </div>

  {/* Right Side - Text + Buttons */}
  <div className="hero-content">
   

    <h1>
      Premium Vehicle Booking Platform for Modern Transportation
    </h1>

    <p>
      Experience seamless, technology-driven mobility solutions with our
      comprehensive fleet management system. Book from 10,000+ professionally
      maintained and GPS-tracked vehicles across 50+ cities with enterprise-grade
      security and 24/7 operational support.
    </p>

    <div className="hero-buttons">
      <button
        onClick={() =>
          handleNavigation(
            user && token && user.role !== "admin"
              ? `/find-route?user=${encodeURIComponent(user.name)}`
              : "/login"
          )
        }
        disabled={user?.role === "admin"}
        className={`hero-button primary ${user?.role === "admin" ? "disabled" : ""}`}
      >
        {user && token
          ? user.role === "admin"
            ? "Administrative Account - Booking Restricted"
            : "Book Now"
          : "Login Find Vehicles"}{" "}
        <ArrowRight size={18} />
      </button>

      <button
        onClick={() =>
          handleNavigation(user?.role === "admin" ? "/admin/dashboard" : "/vehicles")
        }
        className="hero-button secondary"
      >
        {user?.role === "admin"
          ? "System Administration Panel"
          : "Browse Fleet Catalog"}
      </button>
    </div>
  </div>
</section>




{/* How to Book Section */}
<section id="how-to-book" className="how-section">
  <div className="section-header">
    <h2>How to Book Your Vehicle in 1 Minute</h2>
    <p>Follow these 4 simple steps and get your ride confirmed instantly.</p>
  </div>

  {/* Step 1 */}
  <div className="step-row">
    <div className="step-text">
      <h3>
        <MapPin size={60} color="#ff0000ff" style={{ marginRight: '8px' }} />
        1. Choose Location
      </h3>
      <p>
        Select your pickup and drop-off points with just a few taps. 
        Ensure you provide accurate landmarks or building names to help your driver locate you quickly. 
        You can also save your frequent locations for faster booking in the future.
      </p>
    </div>
    <div className="step-image">
      <img src="./src/assets/Select your pickup and drop-off points.png" alt="Choose Location" />
    </div>
  </div>

  {/* Step 2 */}
  <div className="step-row reverse">
    <div className="step-text">
      <h3>
        <Calendar size={60} color="#007bff" style={{ marginRight: '8px' }} />
        2. Select Date & Time
      </h3>
      <p>
        Pick your preferred schedule that best fits your journey. 
        You can book rides immediately or schedule for later with precise time selection. 
        Reminder notifications ensure you never miss your ride.
      </p>
    </div>
    <div className="step-image">
      <img src="./src/assets/time-date.png" alt="Select Date & Time" />
    </div>
  </div>

  {/* Step 3 */}
  <div className="step-row">
    <div className="step-text">
      <h3>
        <Car size={60} color="#007bff" style={{ marginRight: '8px' }} />
        3. Pick Your Vehicle
      </h3>
      <p>
        Browse from a range of cars, SUVs, and premium rides suited to your needs. 
        Compare features, pricing, and capacity before making a choice. 
        Options for special requirements like luggage, pets, or accessibility are available.
      </p>
    </div>
    <div className="step-image">
      <img src="./src/assets/pickavehicle.png" alt="Pick Vehicle" />
    </div>
  </div>

  {/* Step 4 */}
  <div className="step-row reverse">
    <div className="step-text">
      <h3>
        <CheckCircle size={60} color="#51ff00ff" style={{ marginRight: '8px' }} />
        4. Confirm & Go
      </h3>
      <p>
        Review your booking details and confirm your ride instantly. 
        Make secure payments via multiple options including UPI apps like Google Pay, PhonePe, Paytm, or cards and wallets. 
        Once confirmed, track your driver in real-time, get ETA updates, and enjoy a safe and reliable journey.
      </p>
    </div>
    <div className="step-image">
      <img src="./src/assets/confirm.png" alt="Confirm & Go" />
    </div>
  </div>
</section>



      <Reviews></Reviews>

      <Cities></Cities>

<Partner></Partner>

     <Policies></Policies>

      {/* Contact Section */}
     
    </div>
  );
}