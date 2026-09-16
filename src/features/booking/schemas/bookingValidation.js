import * as Yup from "yup";

export const routeBookingSchema = Yup.object().shape({
  pickup: Yup.string().required("Pickup location is required"),
  dropoff: Yup.string().required("Dropoff destination is required"),
  pickupDate: Yup.string().required("Pickup date is required"),
  pickupTime: Yup.string().required("Pickup time is required"),
  passengers: Yup.number()
    .min(1, "Minimum 1 passenger")
    .max(15, "Maximum 15 passengers")
    .required("Number of passengers is required"),
  tripType: Yup.string().oneOf(["one-way", "round-trip"]).default("one-way"),
});

export const passengerDetailsSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name is too short").required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .required("Phone number is required"),
  specialRequests: Yup.string().max(300, "Maximum 300 characters"),
});

export const serviceExpansionSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Valid email required").required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required")
    .required("Phone number is required"),
  city: Yup.string().required("City/Location is required"),
  route: Yup.string().required("Requested Route is required"),
  notes: Yup.string(),
});
