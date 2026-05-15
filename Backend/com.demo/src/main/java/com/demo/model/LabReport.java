package com.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "lab_reports")
public class LabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "appointments", "vitals"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "patient", "doctor", "vitals"})
    private Appointment appointment;

    private String doctorName;
    private String labName;
    private LocalDate reportDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(length = 2000)
    private String summary;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "lab_report_id")
    private List<LabReportItem> tests;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, READY, DELIVERED
    }
}