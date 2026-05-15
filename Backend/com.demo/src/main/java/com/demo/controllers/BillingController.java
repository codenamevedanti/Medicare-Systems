package com.demo.controllers;

import com.demo.dto.BillDTO;
import com.demo.model.Bill;
import com.demo.service.BillingService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.demo.dto.BillRequest;
import com.demo.dto.BillItemRequest;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class BillingController {

    private final BillingService billingService;

    @GetMapping
    public ResponseEntity<List<BillDTO>> getAllBills() {
        return ResponseEntity.ok(
            billingService.getAllBills()
                .stream()
                .map(BillDTO::new)
                .collect(java.util.stream.Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDTO> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(new BillDTO(billingService.getBillById(id)));
    }

 
    @PostMapping("/{patientId}")
    public ResponseEntity<BillDTO> createBill(
            @PathVariable String patientId,
            @RequestBody BillRequest request) {          
        Bill bill = billingService.createBill(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new BillDTO(bill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(
            @PathVariable Long id,
            @RequestBody Bill bill) {
        return ResponseEntity.ok(billingService.updateBill(id, bill));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Bill> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(billingService.markAsPaid(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBill(@PathVariable Long id) {
        billingService.deleteBill(id);
        return ResponseEntity.ok("Bill deleted successfully");
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<BillDTO>> getBillsByPatient(@PathVariable String patientId) {
        Long numericId = Long.parseLong(patientId.replaceAll("[^0-9]", ""));
        return ResponseEntity.ok(
            billingService.getBillsByPatient(numericId)
                .stream()
                .map(BillDTO::new)
                .collect(java.util.stream.Collectors.toList())
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Bill>> getBillsByStatus(
            @PathVariable Bill.PaymentStatus status) {
        return ResponseEntity.ok(billingService.getBillsByStatus(status));
    }

    @GetMapping("/revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        return ResponseEntity.ok(billingService.getTotalRevenue());
    }
}