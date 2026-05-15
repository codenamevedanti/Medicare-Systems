package com.demo.service;

import com.demo.model.Bill;
import com.demo.model.BillItem;
import com.demo.repository.BillRepository;
import com.demo.repository.PatientRepository;
import com.demo.dto.BillRequest;
import com.demo.exception.ResourceNotFoundException;
import com.demo.model.Patient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Bill not found with id: " + id));
    }

    public Bill createBill(String patientId, BillRequest request) {
        // Extract numeric ID from "PT-0002" → 2
        Long numericId;
        try {
            numericId = Long.parseLong(patientId.replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            throw new ResourceNotFoundException("Invalid patient ID format: " + patientId);
        }

        Patient patient = patientRepository.findById(numericId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        // Build Bill from request
        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setDoctorName(request.getDoctorName());
        bill.setNotes(request.getNotes());
        bill.setDiscountAmount(request.getDiscountAmount());
        bill.setCreatedAt(LocalDateTime.now());
        bill.setPaymentStatus(Bill.PaymentStatus.PENDING);  // use PENDING, remove UNPAID

        // Map items
        if (request.getItems() != null) {
            List<BillItem> items = request.getItems().stream().map(i -> {
                BillItem item = new BillItem();
                item.setItemName(i.getItemName());
                item.setCategory(i.getCategory());
                item.setQuantity(i.getQuantity());
                item.setPrice(i.getPrice());
                item.setTotalPrice(i.getPrice() * i.getQuantity());
                item.setBill(bill);                         // ← link back to bill
                return item;
            }).collect(Collectors.toList());
            bill.setItems(items);
        }

        // Calculate total after discount
        double subtotal = bill.getItems() == null ? 0.0 :
            bill.getItems().stream().mapToDouble(BillItem::getTotalPrice).sum();
        bill.setTotalAmount(subtotal - (request.getDiscountAmount() != null ? request.getDiscountAmount() : 0.0));

        return billRepository.save(bill);
    }

    public Bill updateBill(Long id, Bill updated) {
        Bill bill = getBillById(id);
        bill.setItems(updated.getItems());
        bill.setTotalAmount(calculateTotal(updated));
        bill.setPaymentStatus(updated.getPaymentStatus());
        bill.setNotes(updated.getNotes());
        return billRepository.save(bill);
    }

    public Bill markAsPaid(Long id) {
        Bill bill = getBillById(id);
        bill.setPaymentStatus(Bill.PaymentStatus.PAID);
        bill.setPaidAt(LocalDateTime.now());
        return billRepository.save(bill);
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }

    public List<Bill> getBillsByPatient(Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    public List<Bill> getBillsByStatus(Bill.PaymentStatus status) {
        return billRepository.findByPaymentStatus(status);
    }

    public Double getTotalRevenue() {
        return billRepository.getTotalRevenue();
    }

    private double calculateTotal(Bill bill) {
        if (bill.getItems() == null) return 0.0;
        return bill.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}