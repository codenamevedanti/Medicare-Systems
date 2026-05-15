package com.demo.model;

import javax.persistence.*;

@Entity
@Table(name = "labs")
public class Lab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String availableTests;
    private String contactNumber;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAvailableTests() { return availableTests; }
    public void setAvailableTests(String availableTests) { this.availableTests = availableTests; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}