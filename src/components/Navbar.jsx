import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import "./Navbar.css";

function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Logout with confirmation
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Navigation
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  // Guest Nav
  const renderGuestNavigation = () => (
    <div className="nav-links">

      <button onClick={() => handleScrollToSection("why-us")} className="nav-link-btn">Why Us</button>
      <button onClick={() => handleScrollToSection("cities")} className="nav-link-btn">Cities</button>
      <button onClick={() => handleScrollToSection("reviews")} className="nav-link-btn">Reviews</button>
      <button onClick={() => handleScrollToSection("policies")} className="nav-link-btn">Policies</button>
      <button onClick={() => handleNavigation("/login")} className="nav-link-btn">Login</button>
      <button onClick={() => handleNavigation("/register")} className="nav-link-btn register-link">Register</button>
    </div>
  );

  // User Nav
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

  // Admin Nav
  const renderAdminNavigation = () => (
    <div className="nav-links">
      <button onClick={() => handleNavigation("/admin")} className="nav-link-btn">Admin Panel</button>
      <button onClick={() => handleNavigation("/admin/vehicles")} className="nav-link-btn">Manage Vehicles</button>
      <button onClick={() => handleNavigation("/admin/users")} className="nav-link-btn">Manage Users</button>
      <div className="user-menu">
        <User size={20} />
        <span>Hello, {user?.name || "Admin"}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );

  // Mobile Guest
  const renderGuestMobileMenu = () => (
    <div className="mobile-menu">
     
      <button onClick={() => handleScrollToSection("why-us")} className="mobile-nav-btn">Why Us</button>
      <button onClick={() => handleScrollToSection("cities")} className="mobile-nav-btn">Cities</button>
      <button onClick={() => handleScrollToSection("reviews")} className="mobile-nav-btn">Reviews</button>
      <button onClick={() => handleScrollToSection("policies")} className="mobile-nav-btn">Policies</button>
      <button onClick={() => handleNavigation("/login")} className="mobile-nav-btn">Login</button>
      <button onClick={() => handleNavigation("/register")} className="mobile-nav-btn">Register</button>
    </div>
  );

  // Mobile User
  const renderUserMobileMenu = () => (
    <div className="mobile-menu">
      <button onClick={() => handleNavigation("/dashboard")} className="mobile-nav-btn">Dashboard</button>
      <button onClick={() => handleNavigation("/profile")} className="mobile-nav-btn">Profile</button>
      <div className="mobile-user-info">
        <span>Hello, {user?.name || "User"}</span>
        <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
      </div>
    </div>
  );

  // Mobile Admin
  const renderAdminMobileMenu = () => (
    <div className="mobile-menu">
      <button onClick={() => handleNavigation("/admin")} className="mobile-nav-btn">Admin Panel</button>
      <button onClick={() => handleNavigation("/admin/vehicles")} className="mobile-nav-btn">Manage Vehicles</button>
      <button onClick={() => handleNavigation("/admin/users")} className="mobile-nav-btn">Manage Users</button>
      <div className="mobile-user-info">
        <span>Hello, {user?.name || "Admin"}</span>
        <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
      </div>
    </div>
  );

  return (
    <nav className="navbar">
     <img 
        src="./src/assets/logo.png" 
        alt="Blsride Logo" 
        className="nav-logo"
        onClick={() => navigate('/')}
      />

      {/* Desktop Navigation */}
      {user && token ? (
        user.role === "admin"
          ? renderAdminNavigation()
          : renderUserNavigation()
      ) : (
        renderGuestNavigation()
      )}

      {/* Mobile Toggle */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen &&
        (user && token
          ? user.role === "admin"
            ? renderAdminMobileMenu()
            : renderUserMobileMenu()
          : renderGuestMobileMenu())}

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
      />
    </nav>
  );
}

export default Navbar;
