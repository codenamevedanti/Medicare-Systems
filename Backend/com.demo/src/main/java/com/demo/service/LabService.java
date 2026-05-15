package com.demo.service;

import com.demo.model.Lab;
import com.demo.repository.LabRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LabService {

    private final LabRepository repo;

    public LabService(LabRepository repo) {
        this.repo = repo;
    }

    public List<Lab> getAll() { return repo.findAll(); }
    public Lab save(Lab l) { return repo.save(l); }
    public void delete(Long id) { repo.deleteById(id); }
}