package com.demo.controllers;

import com.demo.model.Medicine;
import com.demo.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(pharmacyService.getAllMedicines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(
            @PathVariable Long id) {
        return ResponseEntity.ok(pharmacyService.getMedicineById(id));
    }

    @PostMapping
    public ResponseEntity<Medicine> addMedicine(
            @RequestBody Medicine medicine) {
        return ResponseEntity.ok(pharmacyService.addMedicine(medicine));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine) {
        return ResponseEntity.ok(pharmacyService.updateMedicine(id, medicine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable Long id) {
        pharmacyService.deleteMedicine(id);
        return ResponseEntity.ok("Medicine deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchByName(
            @RequestParam String name) {
        return ResponseEntity.ok(pharmacyService.searchByName(name));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Medicine>> getByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(pharmacyService.getByCategory(category));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Medicine>> getLowStock(
            @RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(pharmacyService.getLowStock(threshold));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Medicine> updateStock(
            @PathVariable Long id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(pharmacyService.updateStock(id, quantity));
    }

    @PatchMapping("/{id}/dispense")
    public ResponseEntity<Medicine> dispenseMedicine(
            @PathVariable Long id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(
            pharmacyService.dispenseMedicine(id, quantity));
    }
}