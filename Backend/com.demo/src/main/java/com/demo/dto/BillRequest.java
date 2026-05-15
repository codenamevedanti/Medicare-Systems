package com.demo.dto;

import java.util.List;

public class BillRequest {

    private List<BillItemRequest> items;
    private String notes;
    private Double discountAmount;
    private Double totalAmount;
    private String doctorName;
    private String date;

    // Getters and Setters
    public List<BillItemRequest> getItems() { return items; }
    public void setItems(List<BillItemRequest> items) { this.items = items; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(double discountAmount) { this.discountAmount = discountAmount; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}