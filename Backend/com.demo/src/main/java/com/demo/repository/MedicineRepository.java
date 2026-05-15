package com.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.model.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
	List<Medicine> findByNameContainingIgnoreCase(String name);
    List<Medicine> findByStockQuantityLessThan(Integer threshold);
    List<Medicine> findByCategory(String category);
    List<Medicine> findByActive(boolean active);
}
