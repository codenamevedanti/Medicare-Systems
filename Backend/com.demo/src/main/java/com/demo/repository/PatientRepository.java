package com.demo.repository;

import com.demo.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
    List<Patient> findByActive(boolean active);
    boolean existsByEmail(String email);
    Optional<Patient> findByUserId(Long userId);
    //Optional<Patient> findByPatientId(String patientId);
}