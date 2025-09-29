import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./BookingConfirmation.css";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  // Save booking to localStorage on first load
  useEffect(() => {
    if (location.state?.booking) {
      setBooking(location.state.booking);
      localStorage.setItem("lastBooking", JSON.stringify(location.state.booking));
    } else {
      const savedBooking = localStorage.getItem("lastBooking");
      if (savedBooking) setBooking(JSON.parse(savedBooking));
    }
  }, [location.state]);

  // Redirect if no booking
  useEffect(() => {
    if (!booking) {
      const timer = setTimeout(() => navigate("/dashboard"), 3000);
      return () => clearTimeout(timer);
    }
  }, [booking, navigate]);

  if (!booking) {
    return (
      <div className="bc-page">
        <div className="bc-card">
          <h2>Booking not found!</h2>
          <p>Redirecting to home page...</p>
          <button className="bc-button" onClick={() => navigate("/")}>
            Go Home Now
          </button>
        </div>
      </div>
    );
  }

  // Safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Download PDF
  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setFont(undefined, "bold");
      doc.text("BLS Ride - Booking Confirmation", 14, 20);

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");

      const details = [
        { label: "Booking Code:", value: booking.bookingCode || "N/A" },
        { label: "Vehicle:", value: booking.vehicle ? `${booking.vehicle.name} (${booking.vehicle.brand || "N/A"})` : "N/A" },
        { label: "Origin:", value: booking.origin || "N/A" },
        { label: "Destination:", value: booking.destination || "N/A" },
        { label: "Start Date:", value: formatDate(booking.startDate) },
        { label: "End Date:", value: formatDate(booking.endDate) },
        { label: "Round Trip:", value: booking.isRoundTrip ? "Yes" : "No" },
        { label: "Total Paid:", value: `₹${booking.totalPrice || 0}` },
        { label: "Payment Status:", value: booking.paymentStatus || "N/A" },
        { label: "Transaction ID:", value: booking.payment?.providerPaymentId || "N/A" },
        { label: "Booking Date:", value: formatDate(booking.createdAt || new Date()) },
        { label: "Booked By:", value: booking.user?.name || booking.user?.email || "N/A" },
      ];

      let y = 40;
      details.forEach((item) => {
        doc.setFont(undefined, "bold");
        doc.text(item.label, 14, y);
        doc.setFont(undefined, "normal");
        doc.text(item.value, 80, y);
        y += 10;
      });

      doc.setFontSize(10);
      doc.setFont(undefined, "italic");
      doc.text("Thank you for choosing BLS Ride!", 14, y + 10);
      doc.text("For support, contact us at Rideinbls@gmail.com", 14, y + 20);

      doc.save(`Booking_${booking.bookingCode || "Confirmation"}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div className="bc-page">
      <div className="bc-card">
        <div className="bc-tick-container">
          <svg className="tick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="tick-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="tick-check" fill="none" d="M14 27l7 7 17-17" />
          </svg>
        </div>

        <h1 className="bc-title">Booking Confirmed!</h1>
        <p className="bc-message">
          Your payment was successful and your booking has been confirmed.
          Here are your booking details:
        </p>

        <table className="bc-table">
          <tbody>
            <tr><td><strong>Booking Code</strong></td><td>{booking.bookingCode || "N/A"}</td></tr>
            <tr><td><strong>Vehicle</strong></td><td>{booking.vehicle?.name || "N/A"} {booking.vehicle?.brand ? `(${booking.vehicle.brand})` : ""}</td></tr>
            <tr><td><strong>Origin</strong></td><td>{booking.origin || "N/A"}</td></tr>
            <tr><td><strong>Destination</strong></td><td>{booking.destination || "N/A"}</td></tr>
            <tr><td><strong>Start Date</strong></td><td>{formatDate(booking.startDate)}</td></tr>
            <tr><td><strong>End Date</strong></td><td>{formatDate(booking.endDate)}</td></tr>
            {booking.isRoundTrip !== undefined && <tr><td><strong>Round Trip</strong></td><td>{booking.isRoundTrip ? "Yes" : "No"}</td></tr>}
            <tr><td><strong>Total Paid</strong></td><td className="bc-total">₹{booking.totalPrice || 0}</td></tr>
            {booking.paymentStatus && <tr><td><strong>Payment Status</strong></td><td>{booking.paymentStatus}</td></tr>}
            {booking.payment?.providerPaymentId && <tr><td><strong>Transaction ID</strong></td><td>{booking.payment.providerPaymentId}</td></tr>}
            {booking.user && <tr><td><strong>Booked By</strong></td><td>{booking.user.name || booking.user.email}</td></tr>}
          </tbody>
        </table>

        <div className="bc-buttons">
          <button className="bc-button" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
          <button className="bc-button bc-download" onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
