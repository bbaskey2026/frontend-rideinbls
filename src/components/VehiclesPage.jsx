import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import API_ENDPOINTS from "../config/api";
import BrandLoader from "./BrandLoader";
import { Car, Users, Fuel, MapPin, Frown } from "lucide-react";
import "./VehiclesPage.css";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingStates, setBookingStates] = useState({});
  const [vehiclePrices, setVehiclePrices] = useState({});

  const { token } = useContext(AuthContext);
  const query = new URLSearchParams(useLocation().search);
  const source = query.get("source");
  const destination = query.get("destination");
  const navigate = useNavigate();

  /** Initialize booking state */
  const initializeBookingState = () => ({ isRoundTrip: false, startAt: "", endAt: "" });
  const getBookingState = (id) => bookingStates[id] || initializeBookingState();

  /** Calculate price considering distance, schedule, and round-trip */
  const calculatePrice = (vehicle, bookingState) => {
    const { isRoundTrip, startAt, endAt } = bookingState || {};

    // 1️⃣ Base price from distance (backend)
    let basePrice = vehicle.priceBreakdown?.total ?? 0;

    const pricePerHour = vehicle.pricePerHour ?? 0;

    // 2️⃣ Add schedule price if start/end exists
    if (startAt && endAt) {
      const start = new Date(startAt);
      const end = new Date(endAt);

      if (!isNaN(start) && !isNaN(end) && end > start) {
        const totalMilliseconds = end - start;
        const totalHours = totalMilliseconds / (1000 * 60 * 60);
        const days = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;

        let schedulePrice = 0;
        if (days > 0) schedulePrice += days * pricePerHour * 24;
        schedulePrice += remainingHours * pricePerHour;

        basePrice += schedulePrice;
      } else {
        basePrice += pricePerHour; // fallback
      }
    }

    // 3️⃣ Apply round-trip multiplier
    if (isRoundTrip) basePrice *= 2;

    return Number(basePrice.toFixed(2));
  };

  /** Update booking state and price */
  const updateBookingState = (vehicleId, updates) => {
    setBookingStates((prev) => {
      const newState = { ...prev, [vehicleId]: { ...prev[vehicleId], ...updates } };
      const vehicle = vehicles.find((v) => v._id === vehicleId);
      if (vehicle) {
        const newPrice = calculatePrice(vehicle, newState[vehicleId]);
        setVehiclePrices((prevPrices) => ({ ...prevPrices, [vehicleId]: newPrice }));
      }
      return newState;
    });
  };

  /** Fetch available vehicles */
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!source || !destination) return;
      setLoading(true);

      try {
        const res = await axios.post(
          API_ENDPOINTS.GOOGLE.DISTANCE,
          { source, destination },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.vehicles && res.data.vehicles.length) {
          const totalDistance = res.data.totalDistance?.km || res.data.route?.distance || 0;
          setDistance(totalDistance);

          const availableVehicles = res.data.vehicles.filter((v) => !v.isBooked);
          setVehicles(availableVehicles);

          // Initialize prices
          const prices = {};
          availableVehicles.forEach((v) => {
            prices[v._id] = calculatePrice(v, getBookingState(v._id));
          });
          setVehiclePrices(prices);
        } else {
          setVehicles([]);
        }
      } catch {
        toast.error("Failed to load vehicles", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [source, destination, token]);

  /** Navigate to payment page */
  const goToPayment = (vehicle) => {
    const bookingState = getBookingState(vehicle._id);
    navigate("/payment", {
      state: {
        vehicle,
        source,
        destination,
        distance: vehicle.totalDistance?.km || 0,
        isRoundTrip: bookingState.isRoundTrip,
        startAt: bookingState.startAt,
        endAt: bookingState.endAt,
        price: vehiclePrices[vehicle._id] || vehicle.priceBreakdown?.total || 0,
      },
    });
  };

  /** Booking form component */
  const VehicleBookingForm = ({ vehicle }) => {
    const { isRoundTrip, startAt, endAt } = getBookingState(vehicle._id);
    const price = vehiclePrices[vehicle._id] || vehicle.priceBreakdown?.total || 0;

    return (
      <div className="booking-section">
        <label className="round-trip-checkbox">
          <input
            type="checkbox"
            checked={isRoundTrip}
            onChange={(e) => updateBookingState(vehicle._id, { isRoundTrip: e.target.checked })}
          />
          Round Trip {isRoundTrip && "(2x price)"}
        </label>

        <div className="datetime-section">
          <label>
            Start Time:
            <input
              type="datetime-local"
              value={startAt}
              onChange={(e) => updateBookingState(vehicle._id, { startAt: e.target.value })}
            />
          </label>
          <label>
            End Time:
            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => updateBookingState(vehicle._id, { endAt: e.target.value })}
            />
          </label>
        </div>

        <div className="price-display">
          <strong>Total Price: ₹{price.toLocaleString("en-IN")}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="vehicles-container">
      {/* Ride Summary */}
      {source && destination && distance !== null && (
        <div className="route-summary">
          <h2>Ride Details</h2>
          <p>
            <strong>From:</strong> {source} <br />
            <strong>To:</strong> {destination} <br />
            <strong>Total Distance:</strong> {distance} km
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <BrandLoader name="RideInBls" caption="Loading..." overlay textColor="#fff" size="60px" />
      )}

      {/* No Vehicles */}
      {!loading && vehicles.length === 0 && (
        <div className="no-vehicles">
          <Frown size={40} />
          <p>No vehicles available right now.</p>
        </div>
      )}

      {/* Vehicles List */}
      {!loading && vehicles.length > 0 && (
        <div className="vehicle-grid">
          {vehicles.map((v) => (
            <div key={v._id} className="vehicle-card">
              <div className="vehicle-image-slider">
                <div className="vehicle-icon-placeholder">
                  <Car size={64} />
                  <span className="vehicle-type-badge">{v.type}</span>
                </div>
              </div>

              <div className="vehicle-content">
                <h3>
                  {v.name} ({v.brand}) - <span className="plate">{v.licensePlate}</span>
                </h3>
                <div className="vehicle-info-grid">
                  <div><Users size={16} /> {v.seats} Seats</div>
                  {v.mileage && <div><Fuel size={16} /> {v.mileage} kmpl</div>}
                  {v.baseLocation && <div><MapPin size={16} /> {v.baseLocation}</div>}
                </div>

                <VehicleBookingForm vehicle={v} />
                <button className="book-btn" onClick={() => goToPayment(v)}>Book & Pay</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
