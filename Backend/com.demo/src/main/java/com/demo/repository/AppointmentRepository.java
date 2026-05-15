package com.demo.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.demo.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = ?1 AND a.appointmentDate = ?2")
    List<Appointment> findByDoctorAndDate(Long doctorId, LocalDate date);
    
 // In AppointmentRepository.java — add this query to fetch with doctor
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor WHERE a.id = :id")
    Optional<Appointment> findByIdWithDoctor(@Param("id") Long id);

    // Or for all appointments:
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor LEFT JOIN FETCH a.patient")
    List<Appointment> findAllWithDetails();
   
}