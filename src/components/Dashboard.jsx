import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import {
  Car,
  XCircle,
  CheckCircle,
  LogOut,
  ListChecks,
  Filter,
  Info,
  AlertTriangle,
  RefreshCcw,
  Copy,
  Check,
} from "lucide-react";
import BrandLoader from "./BrandLoader";
import ConfirmationModal from "./ConfirmationModal";
import API_ENDPOINTS from "../config/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const { user, token, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [vehicleIdInput, setVehicleIdInput] = useState("");
  const [manualCancelLoading, setManualCancelLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Single modal state with action type
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    data: null
  });

  // Only show login modal after auth has finished loading and user is null
  useEffect(() => {
    if (!authLoading && !user) {
      setModal({
        isOpen: true,
        type: "login",
        title: "Login Required",
        message: "You must be logged in to access the dashboard.",
        confirmText: "Go to Login",
        cancelText: "Close",
        data: null
      });
    }
  }, [user, authLoading]);

  // ---------- Fetch Bookings ----------
  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_ENDPOINTS.VEHICLES.MY_BOOKINGS}?page=${page}&limit=6`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();

      if (res.ok) {
        setBookings(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
      } else {
        console.error("Failed to fetch bookings:", result.message);
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token, page]);

  // ---------- Copy Booking Code ----------
  const copyBookingCode = (code) => {
    if (!code) return;
    
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // ---------- Modal Actions ----------
  const handleModalConfirm = async () => {
    switch (modal.type) {
      case "logout":
        logout();
        setModal({ ...modal, isOpen: false });
        break;

      case "cancel":
        await cancelBooking(modal.data);
        break;

      case "login":
        setModal({ ...modal, isOpen: false });
        navigate("/login");
        break;

      case "result":
        setModal({ ...modal, isOpen: false });
        break;

      default:
        setModal({ ...modal, isOpen: false });
    }
  };

  const handleModalCancel = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "login") {
      navigate("/");
    }
  };

  // ---------- Show Modals ----------
  const showLogoutModal = () => {
    setModal({
      isOpen: true,
      type: "logout",
      title: "Confirm Logout",
      message: "Are you sure you want to logout? You will need to sign in again to access your account.",
      confirmText: "Logout",
      cancelText: "Cancel",
      data: null
    });
  };

  const showCancelModal = (vehicleId) => {
    setModal({
      isOpen: true,
      type: "cancel",
      title: "Confirm Cancellation",
      message: `Are you sure you want to cancel booking ${vehicleId}? This action cannot be undone.`,
      confirmText: "Yes, Cancel Booking",
      cancelText: "No, Keep Booking",
      data: vehicleId
    });
  };

  // ---------- Cancel Booking ----------
  const cancelBooking = async (vehicleId) => {
    if (!vehicleId) return;

    setManualCancelLoading(true);
    setModal({ ...modal, isOpen: false });

    try {
      const res = await fetch(
        `${API_ENDPOINTS.PAYMENTS.CANCEL_BY_VEHICLE}/${vehicleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();

      if (res.ok && result.success) {
        setVehicleIdInput("");
        await fetchBookings();
        setModal({
          isOpen: true,
          type: "result",
          title: "Cancellation Successful",
          message: "Your booking has been cancelled successfully. Refund will be processed according to our refund policy.",
          confirmText: "OK",
          cancelText: null,
          data: null
        });
      } else {
        setModal({
          isOpen: true,
          type: "result",
          title: "Cancellation Failed",
          message: result.message || "Failed to cancel booking. Please try again or contact support.",
          confirmText: "OK",
          cancelText: null,
          data: null
        });
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setModal({
        isOpen: true,
        type: "result",
        title: "Error",
        message: "An error occurred while cancelling your booking. Please try again later.",
        confirmText: "OK",
        cancelText: null,
        data: null
      });
    } finally {
      setManualCancelLoading(false);
    }
  };

  // ---------- Format Dates ----------
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    if (!endDate || endDate === startDate) return start;
    return `${start} → ${formatDate(endDate)}`;
  };

  if (authLoading) {
    return (
      <div className="db-layout">
        <BrandLoader name="RideInBls" caption="Loading..." overlay textColor="#111" size="60px" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <ConfirmationModal
          isOpen={modal.isOpen}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
        />
      </>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (filter === "active")
      return b.bookingStatus === "Confirmed" && b.paymentStatus === "Paid";
    if (filter === "completed")
      return b.bookingStatus === "Completed" || b.bookingStatus === "Cancelled";
    return true;
  });

  const canCancel = (booking) =>
    booking.paymentStatus === "Paid" &&
    booking.bookingStatus === "Confirmed" &&
    booking.startDate &&
    new Date(booking.startDate) > new Date();

  return (
    <div className="db-layout">
      <aside className="db-sidebar">
        <h2 className="db-sidebar-title">Dashboard</h2>
        <ul className="db-sidebar-menu">
          <li className="db-sidebar-item db-sidebar-item--active">
            <ListChecks size={18} /> My Bookings
          </li>
          <li className="db-sidebar-item db-sidebar-item--logout" onClick={showLogoutModal}>
            <LogOut size={18} /> Logout
          </li>
        </ul>
      </aside>

      <ConfirmationModal
        isOpen={modal.isOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />

      <main className="db-main">
        <header className="db-header">
          <h2 className="db-title">My Booked Vehicles</h2>
          <p className="db-welcome">
            Welcome, <strong>{user.username || user.name || user.email}</strong>
          </p>
          <p className="db-welcome">
            Email: <strong>{user.email}</strong>
          </p>

          <div className="db-filter-group">
            <button
              className={`db-filter-btn ${filter === "all" ? "db-filter-btn--active" : ""}`}
              onClick={() => setFilter("all")}
            >
              <Filter size={14} /> All ({bookings.length})
            </button>
            <button
              className={`db-filter-btn ${filter === "active" ? "db-filter-btn--active" : ""}`}
              onClick={() => setFilter("active")}
            >
              <CheckCircle size={14} /> Active (
              {bookings.filter((b) => b.bookingStatus === "Confirmed").length})
            </button>
            <button
              className={`db-filter-btn ${filter === "completed" ? "db-filter-btn--active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              <XCircle size={14} /> Completed (
              {bookings.filter(
                (b) => b.bookingStatus === "Cancelled" || b.bookingStatus === "Completed"
              ).length}
              )
            </button>
          </div>
        </header>

        <section className="db-refund-policies">
          <h3>
            <Info size={16} style={{ marginRight: 8, display: "inline" }} />
            Refund Policies
          </h3>
          <ul>
            <li>
              <CheckCircle size={16} color="#22c55e" style={{ marginRight: 6 }} />
              Full refund if cancellation is done at least 48 hours before trip start.
            </li>
            <li>
              <AlertTriangle size={16} color="#f59e0b" style={{ marginRight: 6 }} />
              50% refund if cancellation is done between 24-48 hours before trip start.
            </li>
            <li>
              <XCircle size={16} color="#ef4444" style={{ marginRight: 6 }} />
              No refund if cancellation is done less than 24 hours before trip start.
            </li>
            <li>
              <RefreshCcw size={16} color="#3b82f6" style={{ marginRight: 6 }} />
              Refunds processed within 5-7 business days to original payment method.
            </li>
          </ul>
        </section>

        <section className="db-manual-cancel">
          <h3>Cancel Booking by Vehicle ID</h3>
          <div className="db-manual-cancel-box">
            <input
              type="text"
              placeholder="Enter Booking Code (e.g., BLS-ABC123)"
              value={vehicleIdInput}
              onChange={(e) => setVehicleIdInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && showCancelModal(vehicleIdInput.trim())
              }
            />
            <button
              onClick={() => showCancelModal(vehicleIdInput.trim())}
              disabled={manualCancelLoading || !vehicleIdInput.trim()}
            >
              {manualCancelLoading ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        </section>

        {loading ? (
          <BrandLoader name="RideInBls" caption="Loading, please wait..." overlay textColor="#111" size="60px" />
        ) : filteredBookings.length === 0 ? (
          <div className="db-empty-state">
            <Car size={64} className="db-empty-icon" />
            <p>{filter === "all" ? "You don't have any bookings yet." : `No ${filter} bookings found.`}</p>
          </div>
        ) : (
          <div className="db-booking-grid">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="db-booking-card">
                <div className="db-card-header">
                  {booking.vehicle?.images?.[0] ? (
                    <img
                      src={booking.vehicle.images[0]}
                      alt={booking.vehicle.name || "Vehicle"}
                      className="db-vehicle-image"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="db-image-fallback">
                      <Car size={40} color="#0036fbff" />
                    </div>
                  )}
                  
                  <div className="db-header-info">
                    <h3 className="db-vehicle-name">{booking.vehicle?.name || "Vehicle N/A"}</h3>
                    <div className="db-booking-code">
                      <span>{booking.bookingCode || "N/A"}</span>
                      <button
                        className="db-copy-btn"
                        onClick={() => copyBookingCode(booking.bookingCode)}
                        title="Copy booking code"
                      >
                        {copiedCode === booking.bookingCode ? (
                          <Check size={14} color="#22c55e" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {booking.bookingStatus === "Confirmed" && (
                    <div className="db-status-badge db-status-badge--active">Active</div>
                  )}
                  {booking.bookingStatus === "Cancelled" && (
                    <div className="db-status-badge db-status-badge--cancelled">Cancelled</div>
                  )}
                  {booking.bookingStatus === "Completed" && (
                    <div className="db-status-badge db-status-badge--completed">Completed</div>
                  )}
                </div>

                <div className="db-card-details">
                  <div className="db-info-grid">
                    <div className="db-info-item">
                      <span className="db-info-label">Brand</span>
                      <span className="db-info-value">{booking.vehicle?.brand || "N/A"}</span>
                    </div>
                    <div className="db-info-item">
                      <span className="db-info-label">Type</span>
                      <span className="db-info-value">{booking.vehicle?.type || "N/A"}</span>
                    </div>
                    <div className="db-info-item">
                      <span className="db-info-label">Seats</span>
                      <span className="db-info-value">{booking.vehicle?.capacity || booking.vehicle?.seats || "N/A"}</span>
                    </div>
                    <div className="db-info-item">
                      <span className="db-info-label">Price</span>
                      <span className="db-info-value db-info-value--price">₹{booking.totalPrice || booking.amount || 0}</span>
                    </div>
                  </div>

                  <div className="db-route">
                    <span className="db-route-text">{booking.origin || "N/A"} ➝ {booking.destination || "N/A"}</span>
                  </div>

                  <div className="db-dates">
                    <span className="db-dates-text">{formatDateRange(booking.startDate, booking.endDate)}</span>
                    <span className="db-trip-type">{booking.isRoundTrip ? "Round Trip" : "One Way"}</span>
                  </div>

                  {canCancel(booking) && (
                    <button
                      className="db-cancel-btn"
                      onClick={() => showCancelModal(booking.bookingCode)}
                      disabled={manualCancelLoading}
                    >
                      <XCircle size={16} />
                      {manualCancelLoading ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="db-pagination">
            <button className="db-page-btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>⬅ Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button className="db-page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next ➡</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;