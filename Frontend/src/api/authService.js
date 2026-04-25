// src/api/authService.js

import api from "./axios";

// Login — sends username & password, stores JWT token
export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  const { token } = response.data;
  localStorage.setItem("token", token);
  return response.data;
};

// Register new user
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Change password for a user
export const changePassword = async (userId, oldPassword, newPassword) => {
  const response = await api.put(
    `/auth/change-password/${userId}`,
    null,
    {
      params: { oldPassword, newPassword }, // sent as @RequestParam
    }
  );
  return response.data;
};

// Deactivate a user account
export const deactivateUser = async (userId) => {
  const response = await api.put(`/auth/deactivate/${userId}`);
  return response.data;
};

// Logout — clears token from localStorage
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Check if user is currently logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};