// src/api/billingService.js

import api from "./axios";

// Get all bills
export const getAllBills = () =>
  api.get("/billing");

// Get bill by ID
export const getBillById = (id) =>
  api.get(`/billing/${id}`);

// Create a new bill for a patient
export const createBill = (patientId, data) =>
  api.post(`/billing/${patientId}`, data);

// Update bill details
export const updateBill = (id, data) =>
  api.put(`/billing/${id}`, data);

// Mark bill as paid
export const markAsPaid = (id) =>
  api.put(`/billing/${id}/pay`);

// Delete bill
export const deleteBill = (id) =>
  api.delete(`/billing/${id}`);

// Get all bills for a specific patient
export const getBillsByPatient = (patientId) =>
  api.get(`/billing/patient/${patientId}`);

// Get bills by status — PAID, UNPAID, PARTIAL
export const getBillsByStatus = (status) =>
  api.get(`/billing/status/${status}`);

// Get total revenue
export const getTotalRevenue = () =>
  api.get("/billing/revenue");
