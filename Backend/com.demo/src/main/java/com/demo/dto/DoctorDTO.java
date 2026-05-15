package com.demo.dto;

import lombok.Data;

@Data
public class DoctorDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String specialization;
    private String qualification;
    private String phone;
    private String email;
    private int experience;
    private boolean active;
}