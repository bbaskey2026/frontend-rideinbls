import React, { createContext, useState, useEffect } from "react";
import API_ENDPOINTS from "../config/api"; // ✅ centralized endpoints

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
  const register = async (name, email, password) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, otp: data.otp };
      } else {
        return { success: false, message: data.error || "Registration failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error" };
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
        return { success: true, role: data.user.role || "user" };
      } else {
        return { success: false, message: data.error || "OTP verification failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error" };
    }
  };

  // ----- Login -----
  const login = async (email, password) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, otp: data.otp };
      } else {
        return { success: false, message: data.error || "Login failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error" };
    }
  };

  const verifyLoginOtp = async (email, otp) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN_VERIFY, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserAndToken(data.user, data.token);
        console.log("✅ Login Success:", {
          user: data.user,
          token: data.token,
        });
        return { success: true, role: data.user.role || "user" };
      } else {
        return { success: false, message: data.error || "OTP verification failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error" };
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
