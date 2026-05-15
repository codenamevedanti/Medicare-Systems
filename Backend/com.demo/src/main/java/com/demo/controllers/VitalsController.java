package com.demo.controllers;

import com.demo.model.Appointment;
import com.demo.model.Patient;
import com.demo.model.Vitals;
import com.demo.repository.AppointmentRepository;
import com.demo.repository.PatientRepository;
import com.demo.repository.VitalsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vitals")
@RequiredArgsConstructor
public class VitalsController {

    private final VitalsRepository vitalsRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    // ✅ Get all vitals for a patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Vitals>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(vitalsRepository.findByPatientId(patientId));
    }

    // ✅ Get vitals for a specific appointment
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getByAppointment(@PathVariable Long appointmentId) {
        return vitalsRepository.findByAppointmentId(appointmentId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.ok(null));
    }

    // ✅ Admin adds/updates vitals for an appointment
    @PostMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> saveVitals(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, Object> body) {
        try {
            Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

            // Update or create
            Vitals vitals = vitalsRepository.findByAppointmentId(appointmentId)
                .orElse(new Vitals());

            vitals.setAppointment(appt);
            vitals.setPatient(appt.getPatient());

            if (body.get("bloodPressure") != null)
                vitals.setBloodPressure(body.get("bloodPressure").toString());
            if (body.get("bloodSugar") != null)
                vitals.setBloodSugar(Double.valueOf(body.get("bloodSugar").toString()));
            if (body.get("temperature") != null)
                vitals.setTemperature(Double.valueOf(body.get("temperature").toString()));
            if (body.get("pulse") != null)
                vitals.setPulse(Integer.valueOf(body.get("pulse").toString()));
            if (body.get("spo2") != null)
                vitals.setSpo2(Double.valueOf(body.get("spo2").toString()));
            if (body.get("weight") != null)
                vitals.setWeight(Double.valueOf(body.get("weight").toString()));
            if (body.get("height") != null)
                vitals.setHeight(Double.valueOf(body.get("height").toString()));
            if (body.get("notes") != null)
                vitals.setNotes(body.get("notes").toString());

            Vitals saved = vitalsRepository.save(vitals);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}