package com.demo.repository;

import com.demo.model.LabReport;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    List<LabReport> findByPatient_Id(Long patientId);
    Optional<LabReport> findByAppointment_Id(Long appointmentId);
}