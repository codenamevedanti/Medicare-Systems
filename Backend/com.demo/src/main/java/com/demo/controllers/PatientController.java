package com.demo.controllers;

import com.demo.model.Appointment;
import com.demo.model.Patient;
import com.demo.repository.AppointmentRepository;
import com.demo.repository.PatientRepository;
import com.demo.repository.VitalsRepository;
import com.demo.service.AppointmentService;
import com.demo.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final AppointmentService appointmentService;
    private final VitalsRepository vitalsRepository;


    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(
            @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.createPatient(patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(
            @PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatients(
            @RequestParam String keyword) {
        return ResponseEntity.ok(patientService.searchPatients(keyword));
    }

    // ✅ FIXED — was using getByPatientId (returned Object)
    // Now uses findByPatientId (returns List<Appointment>)
    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<Appointment>> getPatientAppointments(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            appointmentRepository.findByPatientId(id)
        );
    }

    @GetMapping("/{id}/vitals")
    public ResponseEntity<?> getPatientVitals(@PathVariable Long id) {
        return ResponseEntity.ok(vitalsRepository.findByPatientId(id));
    }

    @GetMapping("/{id}/prescriptions")
    public ResponseEntity<?> getPatientPrescriptions(@PathVariable Long id) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}/lab-reports")
    public ResponseEntity<?> getPatientLabReports(@PathVariable Long id) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}/billing")
    public ResponseEntity<?> getPatientBilling(@PathVariable Long id) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getPatientByUserId(@PathVariable Long userId) {
        Optional<Patient> patient = patientRepository.findByUserId(userId);
        if (patient.isPresent()) {
            return ResponseEntity.ok(patient.get());
        }
        return ResponseEntity.notFound().build();
    }
}