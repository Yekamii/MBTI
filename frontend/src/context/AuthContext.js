// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  // Init user
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setUser(decodeToken(token));
  }, []);

  const login = (token) => {
    localStorage.setItem("auth_token", token);
    const payload = decodeToken(token);
    if (payload) setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};