package com.careervault.controller;

import com.careervault.model.JobApplication;
import com.careervault.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationRepository repository;

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    @PostMapping
    public JobApplication createApplication(@RequestBody JobApplication application) {
        return repository.save(application);
    }
}