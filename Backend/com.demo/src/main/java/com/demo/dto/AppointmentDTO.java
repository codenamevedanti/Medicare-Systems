package com.demo.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private String patientFirstName;
    private String patientLastName;
    private Long doctorId;
    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpecialization;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String notes;
}