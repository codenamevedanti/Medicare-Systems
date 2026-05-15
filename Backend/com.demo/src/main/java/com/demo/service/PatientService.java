package com.demo.service;

import com.demo.model.Patient;
import com.demo.repository.PatientRepository;
import com.demo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findByActive(true);
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    public Patient createPatient(Patient patient) {
        patient.setActive(true); // ensure new patients are active
        return patientRepository.save(patient);
    }

    public Patient updatePatient(Long id, Patient updated) {
        Patient patient = getPatientById(id);
        patient.setFirstName(updated.getFirstName());
        patient.setLastName(updated.getLastName());
        patient.setDateOfBirth(updated.getDateOfBirth());
        patient.setGender(updated.getGender());
        patient.setBloodGroup(updated.getBloodGroup());
        patient.setPhone(updated.getPhone());
        patient.setEmail(updated.getEmail());
        patient.setAddress(updated.getAddress());
        patient.setMedicalHistory(updated.getMedicalHistory());
        patient.setAllergies(updated.getAllergies());
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patient.setActive(false);
        patientRepository.save(patient); 
    }
    
 // Search patients by first name or last name
    public List<Patient> searchPatients(String keyword) {
        return patientRepository
            .findByFirstNameContainingOrLastNameContaining(keyword, keyword);
    }
}