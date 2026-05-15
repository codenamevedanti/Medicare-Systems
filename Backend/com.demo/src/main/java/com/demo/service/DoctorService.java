package com.demo.service;

import com.demo.model.Doctor;
import com.demo.repository.DoctorRepository;
import com.demo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByActive(true);
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Doctor not found with id: " + id));
    }

    public Doctor createDoctor(Doctor doctor) {
        doctor.setActive(true);
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor updated) {
        Doctor doctor = getDoctorById(id);
        doctor.setFirstName(updated.getFirstName());
        doctor.setLastName(updated.getLastName());
        doctor.setSpecialization(updated.getSpecialization());
        doctor.setPhone(updated.getPhone());
        doctor.setEmail(updated.getEmail());
        doctor.setQualification(updated.getQualification());
        doctor.setExperience(updated.getExperience());
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctor.setActive(false);
        doctorRepository.save(doctor);
    }

    public List<Doctor> getBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationIgnoreCase(specialization);
    }
    
    public List<Doctor> getByDepartment(String dept) {
        return doctorRepository.findByDepartment(dept);
    }
}