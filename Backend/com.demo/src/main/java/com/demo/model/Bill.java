package com.demo.model;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "bills")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"bills", "appointments", "password", "medicalHistory"})
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    @JsonIgnoreProperties({"bill", "patient", "doctor"})
    private Appointment appointment;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("bill")
    private List<BillItem> items;
    
    private String notes;
    private Double totalAmount;
    private Double paidAmount;
    private Double discountAmount = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String paymentMethod;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime paidAt;
    private String doctorName;  

    public enum PaymentStatus {
        PENDING, PARTIAL, PAID, REFUNDED,UNPAID
    }
}