import * as Yup from "yup";

export const vehicleFormSchema = Yup.object().shape({
  name: Yup.string().required("Vehicle name is required"),
  category: Yup.string().required("Category is required"),
  modelYear: Yup.number()
    .min(2010, "Model year must be 2010 or newer")
    .max(new Date().getFullYear() + 1, "Invalid model year")
    .required("Model year is required"),
  capacity: Yup.number()
    .min(1, "Minimum 1 passenger")
    .max(50, "Maximum 50 passengers")
    .required("Passenger capacity is required"),
  luggageCapacity: Yup.number()
    .min(0, "Cannot be negative")
    .required("Luggage capacity is required"),
  fuelType: Yup.string().required("Fuel type is required"),
  transmission: Yup.string().required("Transmission is required"),
  pricePerKm: Yup.number()
    .positive("Price per km must be greater than 0")
    .required("Price per km is required"),
  baseFare: Yup.number()
    .min(0, "Base fare cannot be negative")
    .required("Base fare is required"),
  driverAllowancePerDay: Yup.number().min(0, "Allowance cannot be negative").default(300),
  features: Yup.string(),
  description: Yup.string(),
});

export const driverOnboardingSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Valid email required").required("Email is required"),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required")
    .required("Mobile number is required"),
  licenseNumber: Yup.string().required("Driving license number is required"),
  experienceYears: Yup.number()
    .min(1, "Minimum 1 year experience required")
    .required("Years of experience required"),
  vehicleModel: Yup.string().required("Vehicle model is required"),
  vehicleNumber: Yup.string().required("Vehicle registration number is required"),
  city: Yup.string().required("Operating city is required"),
});
