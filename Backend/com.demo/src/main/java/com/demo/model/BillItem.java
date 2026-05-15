package com.demo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.*;

@Entity
@Table(name = "bill_items")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;

    private String itemName;
    private String category;  // CONSULTATION, LAB, MEDICINE, PROCEDURE
    private Integer quantity;
    private Double price;
    private Double totalPrice;
}