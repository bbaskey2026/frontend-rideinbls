import React, { useContext,useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Navbar.css";
import ConfirmationModal from './ConfirmationModal';
function Navbar() {
  const { user, logout } = useContext(AuthContext);
  
const [showLogoutModal, setShowLogoutModal] = useState(false);
     const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout(); // Your existing logout function
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-link">RideInBls</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <Link
              to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="nav-link"
            >
              Dashboard
            </Link>
            <span className="user-greeting">
              Hello, {user.name || user.username || user.email}
            </span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}



<ConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
      />






      </div>
    </nav>
  );
}

export default Navbar;