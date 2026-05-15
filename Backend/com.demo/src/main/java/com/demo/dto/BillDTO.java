package com.demo.dto;

import com.demo.model.Bill;
import com.demo.model.BillItem;

import java.util.List;
import java.util.stream.Collectors;

public class BillDTO {
    public Long id;
    public String patientId;
    public String patientName;
    public String doctorName;
    public String date;
    public List<BillItemDTO> services;
    public Double subtotal;
    public Double discount;
    public Double total;
    public String status;
    public String notes;

    public BillDTO(Bill bill) {
        this.id          = bill.getId();
        this.patientId   = bill.getPatient() != null 
                           ? "PT-" + String.format("%04d", bill.getPatient().getId()) 
                           : null;
        this.patientName = bill.getPatient() != null 
                           ? bill.getPatient().getFirstName() + " " + bill.getPatient().getLastName() 
                           : null;
        this.doctorName  = bill.getDoctorName(); 
        this.date        = bill.getCreatedAt() != null 
                           ? bill.getCreatedAt().toLocalDate().toString() 
                           : null;
        this.discount    = bill.getDiscountAmount();
        this.total       = bill.getTotalAmount();
        this.status      = bill.getPaymentStatus() != null 
                           ? bill.getPaymentStatus().name().toLowerCase() 
                           : "pending";
        this.notes       = bill.getNotes();

        if (bill.getItems() != null) {
            this.subtotal  = bill.getItems().stream().mapToDouble(BillItem::getTotalPrice).sum();
            this.services  = bill.getItems().stream().map(BillItemDTO::new).collect(Collectors.toList());
        }
    }
    
}