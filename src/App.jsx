import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Pages / Components
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import BrowseFleetCatalog from "./components/BrowseFleetCatalog";
import VehiclesPage from "./components/VehiclesPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import BookingConfirmation from "./components/BookingConfirmation";
import BookingPage from "./components/BookingPage";
import AdminPayments from "./components/AdminPayments";
import VehicleList from "./components/VehicleList";
import UserBookings from "./components/UserBookings";
import UserProfile from "./components/UserProfile";
import DriverManagement from "./components/DriverManagement";
import PaymentPage from "./components/PaymentPage";
import NotFound from "./components/NotFound";
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global Navbar */}
   <Navbar></Navbar>
        <ToastContainer position="top-center" autoClose={3000} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={< LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/fleet-catalog" element={<BrowseFleetCatalog />} />
          <Route path="/finding-vehicles" element={<VehiclesPage />} />
          <Route path="/find-route" element={<BookingPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
           <Route path="/payment" element={<PaymentPage />} />
           <Route path="*" element={<NotFound />} />
 <Route path="/profile" element={< UserProfile/>} />
          {/* Private User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin Routes (all admin only) */}
          <Route
            path="/admin/payment-analytics"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminPayments />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute adminOnly={true}>
                <UserBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/vehicles"
            element={
              <PrivateRoute adminOnly={true}>
                <VehicleList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute adminOnly={true}>
                <VehicleList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/userbookings"
            element={
              <PrivateRoute adminOnly={true}>
                <UserBookings />
              </PrivateRoute>
            }
          />


          <Route
            path="/driver-signup"
            element={
              <PrivateRoute adminOnly={true}>
                <DriverManagement />
              </PrivateRoute>
            }
          />
        </Routes>





        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
