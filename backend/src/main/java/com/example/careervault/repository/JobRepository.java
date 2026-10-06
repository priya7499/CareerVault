package com.example.careervault.repository;

import com.example.careervault.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    // This allows us to get only the jobs belonging to a specific user
    List<Job> findByUserId(Long userId);
}