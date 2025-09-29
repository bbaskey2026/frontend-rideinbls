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
  const [cancelMsg, setCancelMsg] = useState(null);
  const [manualCancelLoading, setManualCancelLoading] = useState(false);

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

  // Clear cancel message after 5 seconds
  useEffect(() => {
    if (!cancelMsg) return;
    const timer = setTimeout(() => setCancelMsg(null), 5000);
    return () => clearTimeout(timer);
  }, [cancelMsg]);

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
    setCancelMsg(null);
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
        setCancelMsg("Booking cancelled successfully ✅");
        setVehicleIdInput("");
        await fetchBookings();
      } else {
        setCancelMsg(result.message || "Failed to cancel booking ❌");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setCancelMsg("Error cancelling booking ❌");
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

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="dashboard-layout">
        <BrandLoader name="RideInBls" caption="Loading..." overlay textColor="#111" size="60px" />
      </div>
    );
  }

  // Show modal only if user is not logged in after auth finished loading
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

  // ---------- Filtering ----------
  const filteredBookings = bookings.filter((b) => {
    if (filter === "active")
      return b.bookingStatus === "Confirmed" && b.paymentStatus === "Paid";
    if (filter === "completed")
      return b.bookingStatus === "Completed" || b.bookingStatus === "Cancelled";
    return true;
  });

  // ---------- Helper: Can Cancel ----------
  const canCancel = (booking) =>
    booking.paymentStatus === "Paid" &&
    booking.bookingStatus === "Confirmed" &&
    booking.startDate &&
    new Date(booking.startDate) > new Date();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <ul className="sidebar-menu">
          <li className="sidebar-item active">
            <ListChecks size={18} /> My Bookings
          </li>
          <li className="sidebar-item logout" onClick={showLogoutModal}>
            <LogOut size={18} /> Logout
          </li>
        </ul>
      </aside>

      {/* Single Conditional Modal */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2 className="dashboard-title">My Booked Vehicles</h2>
          <p className="dashboard-welcome">
            Welcome, <strong>{user.username || user.name || user.email}</strong>
          </p>
          <p className="dashboard-welcome">
            Email: <strong>{user.email}</strong>
          </p>

          {/* Filters */}
          <div className="filter-group">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              <Filter size={14} /> All ({bookings.length})
            </button>
            <button
              className={`filter-btn ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              <CheckCircle size={14} /> Active (
              {bookings.filter((b) => b.bookingStatus === "Confirmed").length})
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
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

        {/* Refund Policies */}
        <section className="refund-policies">
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

        {/* Manual Cancel */}
        <section className="manual-cancel">
          <h3>Cancel Booking by Vehicle ID</h3>
          <div className="manual-cancel-box">
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
          {cancelMsg && (
            <p className={`cancel-msg ${cancelMsg.includes("✅") ? "success" : "error"}`}>
              {cancelMsg}
            </p>
          )}
        </section>

        {/* Bookings List */}
        {loading ? (
          <BrandLoader name="RideInBls" caption="Loading, please wait..." overlay textColor="#111" size="60px" />
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <Car size={64} className="empty-icon" />
            <p>{filter === "all" ? "You don't have any bookings yet." : `No ${filter} bookings found.`}</p>
          </div>
        ) : (
          <div className="vehicle-grid">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="vehicle-card">
                {booking.vehicle?.images?.[0] ? (
                  <img
                    src={booking.vehicle.images[0]}
                    alt={booking.vehicle.name || "Vehicle"}
                    className="vehicle-image"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="image-fallback">
                    <Car size={60} color="#0036fbff" />
                  </div>
                )}

                {booking.bookingStatus === "Confirmed" && (
                  <div className="booked-badge"><XCircle size={16} /> Active Booking</div>
                )}

                <div className="vehicle-details">
                  <h3>{booking.vehicle?.name || "Vehicle Name N/A"}</h3>
                  <p><strong>Brand:</strong> {booking.vehicle?.brand || "N/A"}</p>
                  <p><strong>Type:</strong> {booking.vehicle?.type || "N/A"}</p>
                  <p><strong>Seats:</strong> {booking.vehicle?.capacity || booking.vehicle?.seats || "N/A"}</p>
                  <p><strong>License Plate:</strong> {booking.vehicle?.licensePlate || "N/A"}</p>
                  <p><strong>Total Price:</strong> ₹{booking.totalPrice || booking.amount || 0}</p>
                  <p><strong>Route:</strong> {booking.origin || "N/A"} ➝ {booking.destination || "N/A"}</p>
                  <p><strong>Trip Dates:</strong> {formatDateRange(booking.startDate, booking.endDate)}</p>
                  <p><strong>Trip Type:</strong> {booking.isRoundTrip ? "Round Trip" : "One Way"}</p>
                  <p><strong>Booking Code:</strong> {booking.bookingCode || "N/A"}</p>
                  <p><strong>Payment Status:</strong> {booking.paymentStatus || "N/A"}</p>
                  <p><strong>Booking Status:</strong>{" "}
                    {booking.bookingStatus === "Confirmed" ? (
                      <span className="status-booked"><CheckCircle size={14} /> Active</span>
                    ) : (
                      <span className="status-available"><XCircle size={14} /> {booking.bookingStatus || "Cancelled"}</span>
                    )}
                  </p>

                  {canCancel(booking) && (
                    <button
                      className="cancel-button"
                      onClick={() => showCancelModal(booking.bookingCode)}
                      disabled={manualCancelLoading}
                    >
                      {manualCancelLoading ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>⬅ Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next ➡</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;