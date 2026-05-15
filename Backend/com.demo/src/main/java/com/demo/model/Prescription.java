package com.demo.model;

import javax.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Data               
@NoArgsConstructor  
@AllArgsConstructor 
@Builder           

public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment primary key
    private Long id;

    // Many prescriptions can belong to one patient
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Many prescriptions can be written by one doctor
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Prescription is optionally linked to a specific appointment
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    // One prescription can have multiple medicine items
    // @JoinColumn: adds prescription_id foreign key in prescription_items table
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "prescription_id")
    private List<PrescriptionItem> items;

    private LocalDate prescriptionDate; // date prescription was issued
    private LocalDate validUntil;       // expiry date (optional)

    @Column(length = 1000)
    private String diagnosis; // doctor's diagnosis notes

    @Column(length = 1000)
    private String notes; // additional instructions for patient

    // Stored as string in DB (e.g. "ACTIVE") instead of index number
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE; 

    private LocalDateTime createdAt = LocalDateTime.now(); // auto-set on creation

    // Possible states of a prescription
    public enum Status {
        ACTIVE,     
        DISPENSED,  
        EXPIRED,    
        CANCELLED   
    }
}