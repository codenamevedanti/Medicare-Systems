// src/api/patientService.js

import api from "./axios";

// Get all patients
export const getAllPatients = () =>
  api.get("/patients");

// Get patient by ID
export const getPatientById = (id) =>
  api.get(`/patients/${id}`);

// Register a new patient
export const createPatient = (data) =>
  api.post("/patients", data);

// Update patient details
export const updatePatient = (id, data) =>
  api.put(`/patients/${id}`, data);

// Delete patient
export const deletePatient = (id) =>
  api.delete(`/patients/${id}`);

// Search patients by keyword (name, phone, etc.)
export const searchPatients = (keyword) =>
  api.get("/patients/search", { params: { keyword } });