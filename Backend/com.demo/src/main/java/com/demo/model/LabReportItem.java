package com.demo.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "lab_report_items")
public class LabReportItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String testName;
    private String result;
    private String normalRange;
    private String unit;
    private String remarks;
}