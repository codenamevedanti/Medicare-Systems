package com.demo.repository;

import com.demo.model.Vitals;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VitalsRepository extends JpaRepository<Vitals, Long> {
    List<Vitals> findByPatientId(Long patientId);
    Optional<Vitals> findByAppointmentId(Long appointmentId);
}