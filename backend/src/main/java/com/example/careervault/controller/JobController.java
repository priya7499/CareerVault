package com.example.careervault.controller;

import com.example.careervault.model.Job;
import com.example.careervault.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    // 1. GET ALL JOBS FOR A SPECIFIC USER
    @GetMapping("/user/{userId}")
    public List<Job> getUserJobs(@PathVariable Long userId) {
        return jobRepository.findByUserId(userId);
    }

    // 2. ADD A NEW JOB
    @PostMapping("/add")
    public Job addJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    // 3. DELETE A JOB
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId) {
        jobRepository.deleteById(jobId);
        return ResponseEntity.ok("Job deleted successfully");
    }
}