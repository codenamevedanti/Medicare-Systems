package com.demo.controllers;

import com.demo.model.Doctor;
import com.demo.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(
            @PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(
            @RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.createDoctor(doctor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, doctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(
            @PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Doctor deleted successfully");
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getBySpecialization(
            @PathVariable String specialization) {
        return ResponseEntity.ok(
            doctorService.getBySpecialization(specialization));
    }
    
 
    @GetMapping("/department/{dept}")
    public ResponseEntity<List<Doctor>> getByDepartment(
            @PathVariable String dept) {
        return ResponseEntity.ok(
            doctorService.getByDepartment(dept));
    }
}