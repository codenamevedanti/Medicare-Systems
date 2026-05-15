package com.demo.controllers;

import com.demo.model.Department;
import com.demo.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    // Public - anyone can view
    @GetMapping
    public List<Department> getAll() {
        return service.getAll();
    }

    // Admin only - add department
    @PostMapping
    public ResponseEntity<Department> create(@RequestBody Department department) {
        return ResponseEntity.ok(service.save(department));
    }

    // Admin only - delete department
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}