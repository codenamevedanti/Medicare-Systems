// src/api/doctorService.js

import api from "./axios";

// Get all doctors
export const getAllDoctors = () =>
  api.get("/doctors");

// Get doctor by ID
export const getDoctorById = (id) =>
  api.get(`/doctors/${id}`);

// Create a new doctor
export const createDoctor = (data) =>
  api.post("/doctors", data);

// Update doctor details
export const updateDoctor = (id, data) =>
  api.put(`/doctors/${id}`, data);

// Delete doctor
export const deleteDoctor = (id) =>
  api.delete(`/doctors/${id}`);

// Get doctors by specialization e.g. "Cardiology"
export const getDoctorsBySpecialization = (specialization) =>
  api.get(`/doctors/specialization/${specialization}`);