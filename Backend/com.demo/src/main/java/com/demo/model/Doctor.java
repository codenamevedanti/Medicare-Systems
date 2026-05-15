package com.demo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.*;

@Entity
@Table(name = "doctors")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String specialization;
    private String qualification;
    private String phone;
    private String email;
    private String licenseNumber;
    private Integer experience;
    private Double consultationFee;
    private String availableDays;   // "MON,TUE,WED,THU,FRI"
    private String availableTime;
    private String department;  // "09:00-17:00"
    private boolean active = true;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}