package com.demo.repository;

import com.demo.model.Lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {
    // Lab-specific queries only (e.g. findByName, etc.)
}