// Dynamic Base URL: Use localhost in development, fallback to environment variable or production Render URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://backend-rideinbls.onrender.com/api");

// API endpoints configuration
const API_ENDPOINTS = {
  IMAGES: {
    FETCH: `${BASE_URL}/images`,
  },
  AUTH: {
    ME: `${BASE_URL}/auth/me`,
    REGISTER: `${BASE_URL}/auth/register`,
    REGISTER_VERIFY: `${BASE_URL}/auth/verify-otp`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGIN_VERIFY: `${BASE_URL}/auth/verify-otp`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    RESEND_OTP: `${BASE_URL}/auth/send-otp`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  },
  GOOGLE: {
    DISTANCE: `${BASE_URL}/google/distance`,
    AUTOCOMPLETE: `${BASE_URL}/google/autocomplete`,
    PLACE_DETAILS: `${BASE_URL}/google/details`,
    DETAILS: `${BASE_URL}/google/details`,
  },
  PAYMENTS: {
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    VERIFY: `${BASE_URL}/payments/verify-payment`,
    CANCEL_BY_VEHICLE: `${BASE_URL}/payments/cancel-booking`,
    ALL_PAYMENTS: `${BASE_URL}/admin/payments`,
    REFUND_REPORT: `${BASE_URL}/admin/refund-report`,
  },
  BOOKINGS: {
    BASE: `${BASE_URL}/bookings`,
    MY_BOOKINGS: `${BASE_URL}/bookings/my-bookings`,
    DETAILS: (id) => `${BASE_URL}/bookings/${id}`,
    CANCEL: (id) => `${BASE_URL}/bookings/${id}/cancel`,
    REFUND: (id) => `${BASE_URL}/bookings/${id}/refund`,
    REFUND_REPORT: `${BASE_URL}/bookings/refund-report`,
  },
  VEHICLES: {
    BASE: `${BASE_URL}/vehicles`,
    AVAILABLE: `${BASE_URL}/vehicles/available`,
    BY_ID: (id) => `${BASE_URL}/vehicles/${id}`,
    MY_BOOKINGS: `${BASE_URL}/bookings/my-bookings`,
    IMAGE: (filename) => `${BASE_URL}/images/filename/${filename}`,
  },
  ADMIN: {
    VEHICLES: {
      BASE: `${BASE_URL}/vehicles`,
      BY_ID: (id) => `${BASE_URL}/vehicles/${id}`,
      TOGGLE: (id) => `${BASE_URL}/vehicles/${id}`,
    },
    USERS: {
      BASE: `${BASE_URL}/admin/users`,
      BY_ID: (id) => `${BASE_URL}/admin/users/${id}`,
      BLOCK: (id) => `${BASE_URL}/admin/users/${id}/status`,
      UNBLOCK: (id) => `${BASE_URL}/admin/users/${id}/status`,
    },
    PAYMENTS: `${BASE_URL}/admin/bookings`,
    STATS: `${BASE_URL}/admin/stats`,
    REFUND_REPORT: `${BASE_URL}/admin/refund-report`,
    REFUND_REPORT_CSV: `${BASE_URL}/admin/refund-report?format=csv`,
  },
  DRIVERS: {
    APPLY: `${BASE_URL}/drivers/apply`,
    ALL: `${BASE_URL}/drivers`,
    BY_ID: (id) => `${BASE_URL}/drivers/${id}`,
  },
};

export { BASE_URL };
export default API_ENDPOINTS;
