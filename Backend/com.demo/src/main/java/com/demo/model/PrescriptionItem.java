package com.demo.model;

import javax.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescription_items") // maps to prescription_items table in DB
@Data               
@NoArgsConstructor  
@AllArgsConstructor 
@Builder            
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment primary key
    private Long id;

    // Optional link to Medicine master table (can be null if medicine was deleted)
    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    private String medicineName;  // store name directly in case medicine record is deleted
    private String dosage;        // e.g. "500mg"
    private String frequency;     // e.g. "Twice a day"
    private String duration;      // e.g. "7 days"
    private Integer quantity;     // total number of tablets/units
    private String instructions;  // e.g. "Take after food"
}