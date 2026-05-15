package com.demo.model;

import lombok.Data;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vitals")
public class Vitals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "patient", "doctor", "vitals"})
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "appointments", "vitals"})
    private Patient patient;

    private String bloodPressure;
    private Double bloodSugar;
    private Double temperature;
    private Integer pulse;
    private Double spo2;
    private Double weight;
    private Double height;

    @Column(length = 1000)
    private String notes;

    private LocalDateTime recordedAt = LocalDateTime.now();
}