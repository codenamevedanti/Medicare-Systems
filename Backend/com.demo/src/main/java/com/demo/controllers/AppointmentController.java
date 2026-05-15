package com.demo.controllers;

import com.demo.model.Appointment;
import com.demo.model.Doctor;
import com.demo.model.Patient;
import com.demo.repository.AppointmentRepository;
import com.demo.repository.DoctorRepository;
import com.demo.repository.PatientRepository;
import com.demo.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final PatientRepository patientRepository;  
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    
    @PostMapping
    public ResponseEntity<?> createOpdAppointment(@RequestBody Map<String, Object> body) {
        try {
            Appointment appt = new Appointment();

            Long patientId = Long.valueOf(body.get("patientId").toString());
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            appt.setPatient(patient);
            appt.setDoctor(null); // no doctor for OPD booking yet

            if (body.get("preferredDate") != null)
                appt.setAppointmentDate(LocalDate.parse(body.get("preferredDate").toString()));

            if (body.get("reason") != null)
                appt.setReason(body.get("reason").toString());

            if (body.get("department") != null)
                appt.setNotes("Dept: " + body.get("department")
                    + (body.get("visitType") != null ? "|" + body.get("visitType") : "")
                    + (body.get("timeSlot") != null ? "|Slot:" + body.get("timeSlot") : ""));

            appt.setStatus(Appointment.AppointmentStatus.SCHEDULED);
            appt.setSource(Appointment.AppointmentSource.ADMIN);
            Appointment saved = appointmentService.save(appt);
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{patientId}/{doctorId}")
    public ResponseEntity<Appointment> createAppointment(
    		
            @PathVariable Long patientId,
            @PathVariable Long doctorId,
            @RequestBody Appointment appointment) {
    	appointment.setSource(Appointment.AppointmentSource.PATIENT);
        return ResponseEntity.ok(appointmentService.createAppointment(patientId, doctorId, appointment));
        
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, appointment));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<String> completeAppointment(@PathVariable Long id) {
        appointmentService.completeAppointment(id);
        return ResponseEntity.ok("Appointment completed successfully");
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getByDoctor(doctorId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(appointmentService.getByStatus(status));
    }
    
 // PUT /api/appointments/{id}/assign-doctor
    @PutMapping("/{id}/assign-doctor")
    public ResponseEntity<?> assignDoctor(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            Long doctorId = Long.valueOf(body.get("doctorId").toString());
            
            // ✅ use findByIdWithDoctor not getAppointmentById
            Appointment appt = appointmentRepository.findByIdWithDoctor(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            appt.setDoctor(doctor);
            appt.setStatus(Appointment.AppointmentStatus.CONFIRMED);
            
            Appointment saved = appointmentRepository.save(appt);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
        
     //frontend calls :/doctors/department/:dept
        @GetMapping("/department/{dept}")
        public ResponseEntity<List<Doctor>> getByDepartment(@PathVariable String dept) {
            return ResponseEntity.ok(doctorRepository.findBySpecialization(dept));
        }
    }
