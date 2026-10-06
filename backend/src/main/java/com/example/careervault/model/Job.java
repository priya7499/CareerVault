package com.example.careervault.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "jobs")
@Data
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String jobTitle;
    private String status; // e.g., Applied, Interviewing, Offer, Rejected
    private String dateApplied;
    private String notes;

    // Links this specific job application to a user ID
    private Long userId;
}