package com.demo.service;

import com.demo.model.Prescription;
import com.demo.model.Prescription.Status;
import com.demo.model.Patient;
import com.demo.model.Doctor;
import com.demo.model.Appointment;
import com.demo.repository.PrescriptionRepository;
import com.demo.repository.PatientRepository;
import com.demo.repository.DoctorRepository;
import com.demo.repository.AppointmentRepository;
import com.demo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    // Get all prescriptions
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // Get single prescription by ID
    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Prescription not found with id: " + id));
    }

    // Create a new prescription linked to patient, doctor, and optionally an appointment
    public Prescription createPrescription(Long patientId,
                                            Long doctorId,
                                            Long appointmentId,
                                            Prescription prescription) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setStatus(Status.ACTIVE); // always start as ACTIVE

        // Appointment is optional
        if (appointmentId != null) {
            Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
            prescription.setAppointment(appointment);
        }

        return prescriptionRepository.save(prescription);
    }

    // Update diagnosis, notes, items, dates of existing prescription
    public Prescription updatePrescription(Long id, Prescription updated) {
        Prescription prescription = getPrescriptionById(id);
        prescription.setDiagnosis(updated.getDiagnosis());
        prescription.setNotes(updated.getNotes());
        prescription.setItems(updated.getItems());
        prescription.setValidUntil(updated.getValidUntil());
        prescription.setPrescriptionDate(updated.getPrescriptionDate());
        return prescriptionRepository.save(prescription);
    }

    // Mark prescription as dispensed (medicines given to patient)
    public Prescription markAsDispensed(Long id) {
        Prescription prescription = getPrescriptionById(id);
        prescription.setStatus(Status.DISPENSED);
        return prescriptionRepository.save(prescription);
    }

    // Cancel a prescription
    public Prescription cancelPrescription(Long id) {
        Prescription prescription = getPrescriptionById(id);
        prescription.setStatus(Status.CANCELLED);
        return prescriptionRepository.save(prescription);
    }

    // Delete prescription permanently
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    // Get all prescriptions for a specific patient
    public List<Prescription> getByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    // Get all prescriptions written by a specific doctor
    public List<Prescription> getByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    // Get all prescriptions linked to a specific appointment
    public List<Prescription> getByAppointment(Long appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId);
    }

    // Get prescriptions filtered by status (ACTIVE, DISPENSED, etc.)
    public List<Prescription> getByStatus(Status status) {
        return prescriptionRepository.findByStatus(status);
    }
}