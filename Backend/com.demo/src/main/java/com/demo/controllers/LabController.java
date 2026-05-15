package com.demo.controllers;

import com.demo.model.Lab;
import com.demo.service.LabService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/labs")
public class LabController {

    private final LabService service;

    public LabController(LabService service) {
        this.service = service;
    }

    // Public - anyone can view
    @GetMapping
    public List<Lab> getAll() {
        return service.getAll();
    }

    // Admin only - add lab
    @PostMapping
    public ResponseEntity<Lab> create(@RequestBody Lab lab) {
        return ResponseEntity.ok(service.save(lab));
    }

    // Admin only - delete lab
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}