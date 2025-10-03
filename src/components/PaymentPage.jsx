import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import API_ENDPOINTS from "../config/api";
import "./PaymentPage.css";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Destructure data from VehiclesPage
  const { vehicle, source, destination, distance, isRoundTrip, startAt, endAt, price } = state || {};
  const totalPrice = price || 0;

  useEffect(() => {
    // If vehicle data missing OR already booked, navigate back to vehicles page
    if (!vehicle || vehicle.isBooked) {
      toast.error("This vehicle is already booked or unavailable.");
      navigate("/vehicles");
    }
  }, [vehicle, navigate]);

  const handlePayment = async () => {
    if (!vehicle || vehicle.isBooked) return;

    setLoading(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        vehicleId: vehicle._id,
        amount: totalPrice,
        origin: source,
        destination,
        isRoundTrip,
        startDate: startAt,
        endDate: endAt,
      };

      const { data } = await axios.post(
        API_ENDPOINTS.PAYMENTS.CREATE_ORDER,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: data.data.key,
        amount: data.data.amount,
        currency: data.data.currency,
        name: "RideInBls",
        description: `${vehicle.name} booking`,
        order_id: data.data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              API_ENDPOINTS.PAYMENTS.VERIFY,
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (verifyRes.data.success) {
              toast.success("Booking confirmed!");
              navigate("/booking-confirmation", {
                state: { booking: verifyRes.data.data?.booking },
              });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error(`Payment verification failed: ${err.message}`);
          }
        },
        prefill: { name: user?.name || user?.email, email: user?.email || "" },
        theme: { color: "#000000" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(`Payment failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle || vehicle.isBooked) return null;

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2>Confirm & Pay</h2>
        {vehicle && (
          <div className="vehicle-details">
            <p className="vehicle-name">{vehicle.name} ({vehicle.brand})</p>
            <p className="route">From: {source} → To: {destination}</p>
            <p className="distance">Distance: {distance} km</p>
            <p className="price">Total Price: ₹{totalPrice.toLocaleString("en-IN")}</p>
            {isRoundTrip && <p className="round-trip">(Round Trip applied)</p>}
          </div>
        )}
        <button className="pay-button" onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
