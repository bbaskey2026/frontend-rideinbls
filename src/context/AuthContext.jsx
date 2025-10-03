import React, { createContext, useState, useEffect } from "react";
import API_ENDPOINTS from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // Generic function to set user and token
  const setUserAndToken = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Helper function to get headers with JWT authorization
  const getAuthHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  // ----- Registration -----
  const register = async (name, email, mobile, password) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, email, mobile, password }),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, otp: data.otp, message: data.message };
      } else {
        // Handle specific error cases
        let errorMessage = "Registration failed";
        
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        // Common error messages
        if (errorMessage.toLowerCase().includes("already exists") || 
            errorMessage.toLowerCase().includes("already registered")) {
          errorMessage = "User already exists with this email or mobile number";
        } else if (errorMessage.toLowerCase().includes("invalid email")) {
          errorMessage = "Please enter a valid email address";
        } else if (errorMessage.toLowerCase().includes("invalid mobile") || 
                   errorMessage.toLowerCase().includes("invalid phone")) {
          errorMessage = "Please enter a valid mobile number";
        } else if (errorMessage.toLowerCase().includes("password")) {
          errorMessage = "Password must be at least 6 characters long";
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, message: "Unable to connect to server. Please check your internet connection." };
    }
  };

  const verifyRegistrationOtp = async (email, otp) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER_VERIFY, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserAndToken(data.user, data.token);
        console.log("✅ Registration Success:", {
          user: data.user,
          token: data.token,
        });
        return { success: true, role: data.user.role || "user", message: "Registration successful!" };
      } else {
        let errorMessage = "OTP verification failed";
        
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        // Common OTP error messages
        if (errorMessage.toLowerCase().includes("expired")) {
          errorMessage = "OTP has expired. Please request a new one.";
        } else if (errorMessage.toLowerCase().includes("invalid")) {
          errorMessage = "Invalid OTP. Please check and try again.";
        } else if (errorMessage.toLowerCase().includes("already verified")) {
          errorMessage = "Account already verified. Please login.";
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      return { success: false, message: "Unable to verify OTP. Please try again." };
    }
  };

  // ----- Login -----
  const login = async (identifier, password, loginMethod = "email") => {
    try {
      const payload = { password };
      
      // Add email or mobile based on login method
      if (loginMethod === "email") {
        payload.email = identifier;
      } else {
        payload.mobile = identifier;
      }

      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, otp: data.otp, message: data.message };
      } else {
        let errorMessage = "Login failed";
        
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        // Common login error messages
        if (errorMessage.toLowerCase().includes("not found") || 
            errorMessage.toLowerCase().includes("does not exist") ||
            errorMessage.toLowerCase().includes("not registered")) {
          errorMessage = "User not found. Please register first.";
        } else if (errorMessage.toLowerCase().includes("incorrect password") || 
                   errorMessage.toLowerCase().includes("wrong password") ||
                   errorMessage.toLowerCase().includes("invalid password")) {
          errorMessage = "Incorrect password. Please try again.";
        } else if (errorMessage.toLowerCase().includes("invalid credentials")) {
          errorMessage = "Invalid email/mobile or password.";
        } else if (errorMessage.toLowerCase().includes("not verified") || 
                   errorMessage.toLowerCase().includes("verify your account")) {
          errorMessage = "Please verify your account first.";
        } else if (errorMessage.toLowerCase().includes("blocked") || 
                   errorMessage.toLowerCase().includes("suspended")) {
          errorMessage = "Your account has been suspended. Contact support.";
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Unable to connect to server. Please check your internet connection." };
    }
  };

  const verifyLoginOtp = async (identifier, otp, loginMethod = "email") => {
    try {
      const payload = { otp };
      
      // Add email or mobile based on login method
      if (loginMethod === "email") {
        payload.email = identifier;
      } else {
        payload.mobile = identifier;
      }

      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN_VERIFY, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setUserAndToken(data.user, data.token);
        console.log("✅ Login Success:", {
          user: data.user,
          token: data.token,
        });
        return { success: true, role: data.user.role || "user", message: "Login successful!" };
      } else {
        let errorMessage = "OTP verification failed";
        
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        // Common OTP error messages
        if (errorMessage.toLowerCase().includes("expired")) {
          errorMessage = "OTP has expired. Please request a new one.";
        } else if (errorMessage.toLowerCase().includes("invalid") || 
                   errorMessage.toLowerCase().includes("incorrect")) {
          errorMessage = "Invalid OTP. Please check and try again.";
        } else if (errorMessage.toLowerCase().includes("maximum attempts") || 
                   errorMessage.toLowerCase().includes("too many attempts")) {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (errorMessage.toLowerCase().includes("not found")) {
          errorMessage = "Session expired. Please login again.";
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      return { success: false, message: "Unable to verify OTP. Please try again." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setUserAndToken,
        logout,
        register,
        verifyRegistrationOtp,
        login,
        verifyLoginOtp,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;