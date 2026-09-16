import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PrivateRoute from "./PrivateRoute";
import BrandLoader from "../components/common/BrandLoader";

// Lazy load all page feature components
const LandingPage = lazy(() => import("../features/home/components/LandingPage"));
const Login = lazy(() => import("../features/auth/components/Login"));
const Register = lazy(() => import("../features/auth/components/Register"));
const ForgotPassword = lazy(() => import("../features/auth/components/ForgotPassword"));
const ResetPassword = lazy(() => import("../features/auth/components/ResetPassword"));
const BrowseFleetCatalog = lazy(() => import("../features/fleet/components/BrowseFleetCatalog"));
const VehiclesPage = lazy(() => import("../features/fleet/components/VehiclesPage"));
const BookingPage = lazy(() => import("../features/booking/components/BookingPage"));
const BookingConfirmation = lazy(() => import("../features/booking/components/BookingConfirmation"));
const PaymentPage = lazy(() => import("../features/booking/components/PaymentPage"));
const Dashboard = lazy(() => import("../features/dashboard/components/Dashboard"));
const UserProfile = lazy(() => import("../features/dashboard/components/UserProfile"));
const VehicleList = lazy(() => import("../features/admin/components/VehicleList"));
const UserBookings = lazy(() => import("../features/admin/components/UserBookings"));
const AdminPayments = lazy(() => import("../features/admin/components/AdminPayments"));
const DriverManagement = lazy(() => import("../features/admin/components/DriverManagement"));
const NotFound = lazy(() => import("../components/common/NotFound"));

// Helper wrapper for Suspense fallback
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<BrandLoader message="Loading page..." />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "login",
        element: (
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        ),
      },
      {
        path: "register",
        element: (
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <SuspenseWrapper>
            <ForgotPassword />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reset-password",
        element: (
          <SuspenseWrapper>
            <ResetPassword />
          </SuspenseWrapper>
        ),
      },
      {
        path: "fleet-catalog",
        element: (
          <SuspenseWrapper>
            <BrowseFleetCatalog />
          </SuspenseWrapper>
        ),
      },
      {
        path: "finding-vehicles",
        element: (
          <SuspenseWrapper>
            <VehiclesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "find-route",
        element: (
          <SuspenseWrapper>
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "booking-confirmation",
        element: (
          <SuspenseWrapper>
            <BookingConfirmation />
          </SuspenseWrapper>
        ),
      },
      {
        path: "payment",
        element: (
          <SuspenseWrapper>
            <PaymentPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "driver-signup",
        element: (
          <SuspenseWrapper>
            <DriverManagement />
          </SuspenseWrapper>
        ),
      },

      // Authenticated User Routes
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <SuspenseWrapper>
              <Dashboard />
            </SuspenseWrapper>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <SuspenseWrapper>
              <UserProfile />
            </SuspenseWrapper>
          </PrivateRoute>
        ),
      },

      // Admin Only Protected Routes
      {
        path: "admin",
        children: [
          {
            index: true,
            element: (
              <PrivateRoute adminOnly={true}>
                <SuspenseWrapper>
                  <VehicleList />
                </SuspenseWrapper>
              </PrivateRoute>
            ),
          },
          {
            path: "dashboard",
            element: (
              <PrivateRoute adminOnly={true}>
                <SuspenseWrapper>
                  <VehicleList />
                </SuspenseWrapper>
              </PrivateRoute>
            ),
          },
          {
            path: "vehicles",
            element: (
              <PrivateRoute adminOnly={true}>
                <SuspenseWrapper>
                  <VehicleList />
                </SuspenseWrapper>
              </PrivateRoute>
            ),
          },
          {
            path: "users",
            element: (
              <PrivateRoute adminOnly={true}>
                <SuspenseWrapper>
                  <UserBookings />
                </SuspenseWrapper>
              </PrivateRoute>
            ),
          },
          {
            path: "userbookings",
            element: (
              <PrivateRoute adminOnly={true}>
                <SuspenseWrapper>
                  <UserBookings />
                </SuspenseWrapper>
              </PrivateRoute>
            ),
          },
          {
            path: "payment-analytics",
            element: (
              <PrivateRoute adminOnly={true}>
                <SuspenseWrapper>
                  <AdminPayments />
                </SuspenseWrapper>
              </PrivateRoute>
            ),
          },
        ],
      },

      // Catch-all
      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <NotFound />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);

export default router;
