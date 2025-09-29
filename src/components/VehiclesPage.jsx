import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, MapPin, Users, Fuel, Car, Frown } from "lucide-react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "./VehiclesPage.css";
import BrandLoader from "./BrandLoader";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../config/api";   
// ---------- Load Razorpay Script ----------
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ---------- VehiclesPage Component ----------
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingStates, setBookingStates] = useState({});
  const [imageIndexes, setImageIndexes] = useState({});
  const [vehiclePrices, setVehiclePrices] = useState({});

  const { token, user } = useContext(AuthContext);
  const query = new URLSearchParams(useLocation().search);
  const source = query.get("source");
  const destination = query.get("destination");
  const navigate = useNavigate();

  const vehicleTypes = [
    "All", "Sedan", "SUV", "Bike", "Convertible",
    "Truck", "Van", "Coupe", "Wagon", "Other"
  ];

  // ---------- Helpers ----------
  const parseDistanceValue = (dist) => {
    if (!dist && dist !== 0) return 0;
    if (typeof dist === "number") return dist;
    if (typeof dist === "object") {
      if (typeof dist.km === "number") return dist.km;
      if (typeof dist.value === "number") return dist.value;
    }
    const n = Number(dist);
    return isFinite(n) ? n : 0;
  };

  const getPricePerKm = (vehicle) =>
    (vehicle?.pricePerKM ?? vehicle?.pricePerKm) || 0;

  const getPricePerHour = (vehicle) =>
    (vehicle?.pricePerHour ?? vehicle?.pricePerHr) || 0;

  const resolveImageSrc = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object") {
      if (img.url) return img.url;
      if (img.filename) {
        const base =
          import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
          window.location.origin;
        return `${base}/api/vehicles/image/${img.filename}`;
      }
    }
    return "";
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating || 0) ? "star-filled" : "star-empty"}
      />
    ));

  // ---------- Image Slider ----------
  const slideImage = (vehicleId, direction) => {
    setImageIndexes((prev) => {
      const currentIdx = prev[vehicleId] || 0;
      const vehicle = vehicles.find((v) => v._id === vehicleId);
      if (!vehicle?.images?.length) return prev;

      const total = vehicle.images.length;
      const newIdx =
        direction === "next"
          ? (currentIdx + 1) % total
          : (currentIdx - 1 + total) % total;

      return { ...prev, [vehicleId]: newIdx };
    });
  };

  // ---------- Price Calculation ----------
  const calculateTotalPrice = (vehicle, bookingState = {}, dist) => {
    const { startAt, endAt, isRoundTrip } = bookingState || {};
    const distanceInKm = parseDistanceValue(dist);

    const isStartEmpty = !startAt?.trim();
    const isEndEmpty = !endAt?.trim();
    const pricePerKm = getPricePerKm(vehicle);
    const pricePerHour = getPricePerHour(vehicle);

    let basePrice = 0;

    if (distanceInKm && pricePerKm > 0) {
      basePrice = distanceInKm * pricePerKm;
    } else if (!isStartEmpty && !isEndEmpty) {
      const start = new Date(startAt);
      const end = new Date(endAt);
      if (!isNaN(start) && !isNaN(end) && end > start) {
        let hours = Math.ceil((end - start) / (1000 * 60 * 60));
        if (hours <= 0) hours = 1;
        basePrice = hours * pricePerHour;
      } else {
        basePrice = pricePerHour;
      }
    } else {
      basePrice = distanceInKm && pricePerKm > 0
        ? distanceInKm * pricePerKm
        : pricePerHour;
    }

    if (isRoundTrip) basePrice *= 2;
    return Number((basePrice || 0).toFixed(2));
  };

  // ---------- Booking State ----------
  const initializeBookingState = () => ({
    isRoundTrip: false,
    startAt: "",
    endAt: "",
  });

  const getBookingState = (id) =>
    bookingStates[id] || initializeBookingState();

  const updateBookingState = (vehicleId, updates) => {
    setBookingStates((prev) => {
      const newState = {
        ...prev,
        [vehicleId]: { ...prev[vehicleId], ...updates },
      };
      const vehicle = vehicles.find(
        (v) => v._id === vehicleId || v.licensePlate === vehicleId
      );
      if (vehicle) {
        const newPrice = calculateTotalPrice(vehicle, newState[vehicleId], distance);
        setVehiclePrices((prevPrices) => ({
          ...prevPrices,
          [vehicleId]: newPrice,
        }));
      }
      return newState;
    });
  };

  // ---------- Fetch Vehicles ----------
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!source || !destination) return;
      setLoading(true);
      try {
       const res = await axios.post(
  API_ENDPOINTS.GOOGLE.DISTANCE,   // ✅
  { source, destination },
  { headers: { Authorization: `Bearer ${token}` } }
);


        if (res.data.vehicles) {
          console.log("Fetched vehicles:", res.data.vehicles);
          setDistance(res.data.distance);
          setVehicles(res.data.vehicles);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error("Failed to load vehicles. Please try again.", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [source, destination, token]);

  // ---------- Filter ----------
  useEffect(() => {
    setFilteredVehicles(
      selectedType === "All"
        ? vehicles
        : vehicles.filter((v) => v.type === selectedType)
    );
  }, [vehicles, selectedType]);

  // ---------- Initialize Prices ----------
  useEffect(() => {
    if (vehicles.length > 0) {
      const initialPrices = {};
      vehicles.forEach((v) => {
        const bs = getBookingState(v._id);
        initialPrices[v._id] = calculateTotalPrice(v, bs, distance);
      });
      setVehiclePrices(initialPrices);
    }
  }, [vehicles, distance]);

  // ---------- Validation ----------
  const validateBookingInputs = (vehicleId) => {
    const { startAt, endAt } = getBookingState(vehicleId);

    if (!startAt && !endAt) {
      return { startAt: null, endAt: null, valid: true, bookingType: "immediate" };
    }

    if (!startAt || !endAt) {
      toast.error("Please select both start and end times, or leave both empty", {
        position: "top-center",
      });
      return { valid: false };
    }

    const start = new Date(startAt);
    const end = new Date(endAt);

    if (isNaN(start) || isNaN(end) || end <= start) {
      toast.error("Invalid booking times", { position: "top-center" });
      return { valid: false };
    }

    return { startAt: start.toISOString(), endAt: end.toISOString(), valid: true, bookingType: "scheduled" };
  };

  // ---------- Booking ----------
  const confirmBooking = async (vehicle) => {
    const validation = validateBookingInputs(vehicle._id);
    if (!validation.valid) return;

    try {
      setLoading(true);
      const bookingState = getBookingState(vehicle._id);
      const amount =
        vehiclePrices[vehicle._id] ?? calculateTotalPrice(vehicle, bookingState, distance);

      if (!amount || amount <= 0) {
        toast.error("Invalid booking amount", { position: "top-center" });
        setLoading(false);
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load", { position: "top-center" });
        setLoading(false);
        return;
      }

      const safeDistance = parseDistanceValue(distance);

      const orderData = {
        vehicleId: vehicle._id,
        amount,
        origin: source,
        destination,
        isRoundTrip: bookingState.isRoundTrip,
        distance: safeDistance,
        ...(validation.startAt && { startDate: validation.startAt }),
        ...(validation.endAt && { endDate: validation.endAt }),
      };

      const { data } = await axios.post(
  API_ENDPOINTS.PAYMENTS.CREATE_ORDER,   // ✅
  orderData,
  { headers: { Authorization: `Bearer ${token}` } }
);


      if (!data.success) throw new Error(data.message || "Failed to create order");

      const options = {
        key: data.data.key,
        amount: data.data.amount,
        currency: data.data.currency,
        name: "RideInBls",
        description: `${vehicle.name} booking - ${validation.bookingType}`,
        order_id: data.data.orderId,
        handler: async (response) => {
          try {
            const verifyData = {
              ...response,
              vehicleId: vehicle._id,
              isRoundTrip: bookingState.isRoundTrip,
              origin: source,
              destination,
              distance: safeDistance,
              ...(validation.startAt && { startDate: validation.startAt }),
              ...(validation.endAt && { endDate: validation.endAt }),
            };

            const verifyRes = await axios.post(
  API_ENDPOINTS.PAYMENTS.VERIFY,   // ✅
  verifyData,
  { headers: { Authorization: `Bearer ${token}` } }
);


            if (verifyRes.data.success) {
              setVehicles((prev) =>
                prev.map((v) =>
                  v._id === vehicle._id ? { ...v, isBooked: true, available: false } : v
                )
              );
              updateBookingState(vehicle._id, initializeBookingState());
              navigate("/booking-confirmation", { state: { booking: verifyRes.data.data?.booking } });
              toast.success(`${validation.bookingType} booking confirmed!`, { position: "top-center" });
            } else {
              toast.error("Payment verification failed", { position: "top-center" });
            }
          } catch (err) {
            toast.error(`Payment verification failed: ${err.message}`, { position: "top-center" });
          }
        },
        prefill: { name: user?.username || user?.name || user?.email, email: user?.email || "" },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info("Payment cancelled", { position: "top-center" });
          },
        },
      };

      new window.Razorpay(options).open();
      setLoading(false);
    } catch (err) {
      toast.error(`Booking failed: ${err.message}`, { position: "top-center" });
      setLoading(false);
    }
  };

  // ---------- Booking Form ----------
  const VehicleBookingForm = ({ vehicle }) => {
    const { isRoundTrip, startAt, endAt } = getBookingState(vehicle._id);
    return (
      <div className="booking-section">
        <label className="round-trip-label">
          <input
            type="checkbox"
            checked={isRoundTrip}
            onChange={(e) => updateBookingState(vehicle._id, { isRoundTrip: e.target.checked })}
          />
          Round Trip {isRoundTrip && <span className="round-trip-indicator">(2x price)</span>}
        </label>
        <div className="datetime-section">
          <p className="booking-hint">Leave both dates empty for immediate booking</p>
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
      </div>
    );
  };

  // ---------- Price Display ----------
  const PriceDisplay = ({ vehicle }) => {
    const currentPrice = vehiclePrices[vehicle._id] ?? 0;
    const { isRoundTrip } = getBookingState(vehicle._id);
    const distanceNum = parseDistanceValue(distance);
    const pricePerKm = getPricePerKm(vehicle);
    const pricePerHour = getPricePerHour(vehicle);

    return (
      <div className="price-display">
        <div className="price-breakdown">
          {distanceNum > 0 && pricePerKm > 0 ? (
            <small>Distance: {distanceNum.toFixed(1)} km × ₹{pricePerKm}/km {isRoundTrip && "×2"}</small>
          ) : pricePerHour > 0 ? (
            <small>Rate: ₹{pricePerHour}/hour {isRoundTrip && "×2"}</small>
          ) : null}
        </div>
        <div className="total-price">Total: ₹{currentPrice.toLocaleString("en-IN")}</div>
      </div>
    );
  };

  // ---------- Render ----------
  return (
    <div className="vehicles-container">
      <div className="header-section">
        <h2>Available Vehicles from {source} to {destination}</h2>
        {distance !== null && <p className="distance-info">Distance: {parseDistanceValue(distance).toFixed(1)} km</p>}
        <div className="type-switcher">
          {vehicleTypes.map((type) => (
            <button
              key={type}
              className={`type-button ${selectedType === type ? "active" : ""}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <BrandLoader name="BLSRide" caption="Loading Please wait..." overlay textColor="#111" size="60px" />
      ) : filteredVehicles.length === 0 ? (
        <div className="no-vehicles">
          <Frown size={40} strokeWidth={1.5} />
          <p>No vehicles found.</p>
        </div>
      ) : (
        <div className="vehicle-grid">
          {filteredVehicles.map((v, idx) => {
            const currentIdx = imageIndexes[v._id] || 0;
            const key = v.licensePlate || v._id || `vehicle-${idx}`;
            return (
              <div key={key} className={`vehicle-card ${v.isBooked || !v.available ? "booked" : ""}`}>
                <div className="vehicle-image-slider">
                  {v.images?.length ? (
                    <div className="slider-container">
                      {v.images.map((img, i) => (
                        <img
                          key={i}
                          src={resolveImageSrc(img)}
                          alt={`${v.name} - ${i + 1}`}
                          className="slider-image"
                          style={{ display: i === currentIdx ? "block" : "none" }}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = `https://source.unsplash.com/400x250/?car,${v.type}`;
                          }}
                        />
                      ))}
                      {v.images.length > 1 && (
                        <div className="slider-controls">
                          <button onClick={() => slideImage(v._id, "prev")}>&#10094;</button>
                          <button onClick={() => slideImage(v._id, "next")}>&#10095;</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={`https://source.unsplash.com/400x250/?car,${v.type}`}
                      alt={v.name}
                      loading="lazy"
                    />
                  )}
                </div>

                <h3>{v.name} ({v.brand}) - <span className="plate">{v.licensePlate}</span></h3>
                {v.rating && <div className="rating-section">{renderStars(v.rating)} ({v.totalReviews || 0})</div>}

                <div className="vehicle-info-grid">
                  <div><Users size={16} /> {v.seats} Seats</div>
                  {v.mileage && <div><Fuel size={16} /> {v.mileage} kmpl</div>}
                  {v.location && <div><MapPin size={16} /> {v.location}</div>}
                  <div><Car size={16} /> {v.brand}</div>
                </div>

                <div className="pricing-info">
                  {getPricePerKm(v) > 0 && <small>₹{getPricePerKm(v)}/km</small>}
                  {getPricePerHour(v) > 0 && <small>₹{getPricePerHour(v)}/hour</small>}
                </div>

                <VehicleBookingForm vehicle={v} />
                <div className="vehicle-footer">
                  <PriceDisplay vehicle={v} />
                  {!(v.isBooked || !v.available) ? (
                    <button onClick={() => confirmBooking(v)} disabled={loading}>
                      {loading ? "Processing..." : "Book Now"}
                    </button>
                  ) : (
                    <button disabled>Not Available</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
