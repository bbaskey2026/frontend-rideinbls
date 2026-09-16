import React from "react";
import { TextField } from "@mui/material";

export default function FormikMuiField({
  formik,
  name,
  label,
  type = "text",
  placeholder,
  multiline = false,
  rows = 1,
  disabled = false,
  InputProps,
  ...props
}) {
  const isTouched = formik.touched[name];
  const errorMessage = formik.errors[name];
  const hasError = Boolean(isTouched && errorMessage);

  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={label}
      type={type}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
      disabled={disabled}
      value={formik.values[name] ?? ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={hasError}
      helperText={hasError ? errorMessage : props.helperText}
      InputProps={InputProps}
      {...props}
    />
  );
}
