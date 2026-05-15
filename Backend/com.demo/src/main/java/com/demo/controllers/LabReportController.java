package com.demo.controllers;

import com.demo.model.Appointment;
import com.demo.model.LabReport;
import com.demo.model.LabReport.Status;
import com.demo.model.LabReportItem;
import com.demo.repository.AppointmentRepository;
import com.demo.repository.LabReportRepository;
import com.demo.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lab-reports")
@RequiredArgsConstructor
public class LabReportController {

    private final LabReportRepository labReportRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<LabReport>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(labReportRepository.findByPatient_Id(patientId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getByAppointment(@PathVariable Long appointmentId) {
        return labReportRepository.findByAppointment_Id(appointmentId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.ok(null));
    }

    @PostMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> saveLabReport(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, Object> body) {
        try {
            Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

            LabReport report = labReportRepository.findByAppointment_Id(appointmentId)
                .orElse(new LabReport());

            report.setAppointment(appt);
            report.setPatient(appt.getPatient());

            if (body.get("doctorName") != null)
                report.setDoctorName(body.get("doctorName").toString());
            if (body.get("labName") != null)
                report.setLabName(body.get("labName").toString());
            if (body.get("reportDate") != null)
                report.setReportDate(LocalDate.parse(body.get("reportDate").toString()));
            if (body.get("status") != null)
                report.setStatus(Status.valueOf(body.get("status").toString()));
            if (body.get("summary") != null)
                report.setSummary(body.get("summary").toString());

            if (body.get("tests") != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> rawTests = (List<Map<String, Object>>) body.get("tests");
                List<LabReportItem> items = rawTests.stream()
                    .filter(t -> t.get("testName") != null && !t.get("testName").toString().isBlank())
                    .map(t -> {
                        LabReportItem item = new LabReportItem();
                        item.setTestName(t.getOrDefault("testName", "").toString());
                        item.setResult(t.getOrDefault("result", "").toString());
                        item.setNormalRange(t.getOrDefault("normalRange", "").toString());
                        item.setUnit(t.getOrDefault("unit", "").toString());
                        item.setRemarks(t.getOrDefault("remarks", "").toString());
                        return item;
                    }).toList();
                report.setTests(items);
            }

            return ResponseEntity.ok(labReportRepository.save(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}