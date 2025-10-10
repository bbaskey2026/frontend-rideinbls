// Base URL for all API requests
const BASE_URL = "http://localhost:5000/api";

// API endpoints configuration
const API_ENDPOINTS = {



  IMAGES: {
    FETCH: `${BASE_URL}/api/images`, // ✅ This must exist
  },
  AUTH: {
     ME: `${BASE_URL}/auth/me`,
    REGISTER: `${BASE_URL}/auth/register`,
    REGISTER_VERIFY: `${BASE_URL}/auth/register/verify`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGIN_VERIFY: `${BASE_URL}/auth/login/verify`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    RESEND_OTP: `${BASE_URL}/auth/resend-otp`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  },
  GOOGLE: {
    DISTANCE: `${BASE_URL}/google/distance-calculate`,
    AUTOCOMPLETE: `${BASE_URL}/google/autocomplete`,
    PLACE_DETAILS: `${BASE_URL}/google/place-details`,
    DETAILS: `${BASE_URL}/google/details`,
  },
  PAYMENTS: {
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    VERIFY: `${BASE_URL}/payments/verify`,
    CANCEL_BY_VEHICLE: `${BASE_URL}/payments/cancel-by-vehicle`,
    ALL_PAYMENTS: `${BASE_URL}/admin/payments`,
  },
  VEHICLES: {
    BASE: `${BASE_URL}/vehicles`,
    MY_BOOKINGS: `${BASE_URL}/vehicles/my-bookings`,
    IMAGE: (filename) => `${BASE_URL}/vehicles/image/${filename}`,
  },
  ADMIN: {
    VEHICLES: {
      BASE: `${BASE_URL}/admin/vehicles`,
      BY_ID: (id) => `${BASE_URL}/admin/vehicles/${id}`,
      TOGGLE: (id) => `${BASE_URL}/admin/vehicles/${id}/toggle-availability`,
    },
    USERS: {
      BASE: `${BASE_URL}/admin/users`,
      BY_ID: (id) => `${BASE_URL}/admin/users/${id}`,
      BLOCK: (id) => `${BASE_URL}/admin/users/${id}/block`,
      UNBLOCK: (id) => `${BASE_URL}/admin/users/${id}/unblock`,
    },
  },
};

export default API_ENDPOINTS;
