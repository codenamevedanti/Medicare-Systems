package com.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.demo.model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationIgnoreCase(String specialization);
    List<Doctor> findByActive(boolean active);
    List<Doctor> findByDepartment(String department);
}