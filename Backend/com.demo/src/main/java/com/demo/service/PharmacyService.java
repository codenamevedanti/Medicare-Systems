package com.demo.service;

import com.demo.model.Medicine;
import com.demo.repository.MedicineRepository;
import com.demo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final MedicineRepository medicineRepository;

    // Get all active medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findByActive(true);
    }

    // Get medicine by ID
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Medicine not found with id: " + id));
    }

    // Add new medicine
    public Medicine addMedicine(Medicine medicine) {
        medicine.setActive(true);
        return medicineRepository.save(medicine);
    }

    // Update medicine details
    public Medicine updateMedicine(Long id, Medicine updated) {
        Medicine medicine = getMedicineById(id);
        medicine.setName(updated.getName());
        medicine.setGenericName(updated.getGenericName());
        medicine.setCategory(updated.getCategory());
        medicine.setManufacturer(updated.getManufacturer());
        medicine.setDescription(updated.getDescription());
        medicine.setPrice(updated.getPrice());
        medicine.setStockQuantity(updated.getStockQuantity());
        medicine.setReorderLevel(updated.getReorderLevel());
        medicine.setExpiryDate(updated.getExpiryDate());
        medicine.setBatchNumber(updated.getBatchNumber());
        return medicineRepository.save(medicine);
    }

    // Soft delete
    public void deleteMedicine(Long id) {
        Medicine medicine = getMedicineById(id);
        medicine.setActive(false);
        medicineRepository.save(medicine);
    }

    // Update stock — add quantity
    public Medicine updateStock(Long id, Integer quantity) {
        Medicine medicine = getMedicineById(id);
        medicine.setStockQuantity(
            medicine.getStockQuantity() + quantity);
        return medicineRepository.save(medicine);
    }

    // Dispense medicine — reduce stock
    public Medicine dispenseMedicine(Long id, Integer quantity) {
        Medicine medicine = getMedicineById(id);
        if (medicine.getStockQuantity() < quantity) {
            throw new RuntimeException(
                "Insufficient stock for: " + medicine.getName());
        }
        medicine.setStockQuantity(
            medicine.getStockQuantity() - quantity);
        return medicineRepository.save(medicine);
    }

    // Get low stock medicines
    public List<Medicine> getLowStockMedicines() {
        return medicineRepository
            .findByStockQuantityLessThan(
                10); // default threshold
    }

    // Get low stock with custom threshold
    public List<Medicine> getLowStock(int threshold) {
        return medicineRepository
            .findByStockQuantityLessThan(threshold);
    }

    // Search by name
    public List<Medicine> searchMedicines(String name) {
        return medicineRepository
            .findByNameContainingIgnoreCase(name);
    }

    // Get by category
    public List<Medicine> getByCategory(String category) {
        return medicineRepository.findByCategory(category);
    }
}