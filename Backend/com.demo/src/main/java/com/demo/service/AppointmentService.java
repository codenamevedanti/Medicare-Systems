package com.demo.service;

import com.demo.model.*;
import com.demo.repository.*;
import com.demo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final BillRepository billRepository;

    // Get all appointments
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllWithDetails();
    }

    // Get appointment by ID — used by controller
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Appointment not found: " + id));
    }

    // Create new appointment linked to patient and doctor
    public Appointment createAppointment(Long patientId,
                                          Long doctorId,
                                          Appointment appointment) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Doctor not found"));

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        return appointmentRepository.save(appointment);
    }

    // Update appointment details
    public Appointment updateAppointment(Long id,
                                          Appointment updatedAppointment) {
        Appointment existing = getAppointmentById(id);
        existing.setAppointmentDate(updatedAppointment.getAppointmentDate());
        existing.setNotes(updatedAppointment.getNotes());
        existing.setStatus(updatedAppointment.getStatus());
        return appointmentRepository.save(existing);
    }

    // Cancel an appointment
    public void cancelAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    // Mark appointment as completed
    public void completeAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        // Auto-create bill when appointment is completed
        // Check if bill already exists for this appointment
        boolean billExists = billRepository.existsByAppointmentId(id);
        if (!billExists) {
            // Determine fee based on visit type stored in notes
            String notes = appointment.getNotes() != null ? appointment.getNotes() : "";
            boolean isFollowup = notes.toLowerCase().contains("follow");
            double fee = isFollowup ? 200.0 : 300.0;

            Bill bill = new Bill();
            bill.setPatient(appointment.getPatient());
            bill.setAppointment(appointment);
            bill.setTotalAmount(fee);
            bill.setPaidAmount(fee);
            bill.setPaymentStatus(Bill.PaymentStatus.PAID);
            bill.setPaymentMethod("Online");
            bill.setNotes(isFollowup ? "Follow-Up Visit" : "New Consultation");
            bill.setCreatedAt(LocalDateTime.now());
            billRepository.save(bill);
        }
    }

    // Get appointments by status string
    public List<Appointment> getByStatus(String status) {
        Appointment.AppointmentStatus appointmentStatus =
            Appointment.AppointmentStatus.valueOf(status.toUpperCase());
        return appointmentRepository.findByStatus(appointmentStatus);
    }

    // Get appointments by date
    public List<Appointment> getByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    // Get all appointments for a specific patient
    public List<Appointment> getByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    // Get all appointments for a specific doctor
    public List<Appointment> getByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
    
    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }
}