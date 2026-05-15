package com.demo.service;

import com.demo.model.Department;
import com.demo.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository repo;

    public DepartmentService(DepartmentRepository repo) {
        this.repo = repo;
    }

    public List<Department> getAll() { return repo.findAll(); }
    public Department save(Department d) { return repo.save(d); }
    public void delete(Long id) { repo.deleteById(id); }
}