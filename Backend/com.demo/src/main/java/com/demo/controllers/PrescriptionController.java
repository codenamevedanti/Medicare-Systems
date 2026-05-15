package com.demo.controllers;

import com.demo.model.Prescription;
import com.demo.model.Prescription.Status;
import com.demo.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @GetMapping
    public ResponseEntity<List<Prescription>> getAll() {
        return ResponseEntity.ok(
            prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            prescriptionService.getPrescriptionById(id));
    }

    @PostMapping("/{patientId}/{doctorId}")
    public ResponseEntity<Prescription> create(
            @PathVariable Long patientId,
            @PathVariable Long doctorId,
            @RequestParam(required = false) Long appointmentId,
            @RequestBody Prescription prescription) {
        return ResponseEntity.ok(
            prescriptionService.createPrescription(
                patientId, doctorId, appointmentId, prescription));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> update(
            @PathVariable Long id,
            @RequestBody Prescription prescription) {
        return ResponseEntity.ok(
            prescriptionService.updatePrescription(id, prescription));
    }

    @PutMapping("/{id}/dispense")
    public ResponseEntity<Prescription> markAsDispensed(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            prescriptionService.markAsDispensed(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Prescription> cancel(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            prescriptionService.cancelPrescription(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok(
            "Prescription deleted successfully");
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getByPatient(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
            prescriptionService.getByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getByDoctor(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(
            prescriptionService.getByDoctor(doctorId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Prescription>> getByStatus(
            @PathVariable Status status) {
        return ResponseEntity.ok(
            prescriptionService.getByStatus(status));
    }
}