package com.example.careervault.controller;

import com.example.careervault.model.Experience;
import com.example.careervault.model.User;
import com.example.careervault.repository.ExperienceRepository;
import com.example.careervault.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/experience")
@CrossOrigin(origins = "http://localhost:5173")
public class ExperienceController {

    private final ExperienceRepository experienceRepository;
    private final UserRepository userRepository;

    public ExperienceController(
            ExperienceRepository experienceRepository,
            UserRepository userRepository) {

        this.experienceRepository = experienceRepository;
        this.userRepository = userRepository;
    }

    // GET all experiences for a user
    @GetMapping("/{userId}")
    public ResponseEntity<?> getExperiences(
            @PathVariable Long userId) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Experience> experiences =
                experienceRepository.findByUser(user.get());

        return ResponseEntity.ok(experiences);
    }

    // ADD experience
    @PostMapping("/{userId}")
    public ResponseEntity<?> addExperience(
            @PathVariable Long userId,
            @RequestBody ExperienceRequest request) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (request.jobTitle == null ||
                request.jobTitle.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Job title is required");
        }

        if (request.companyName == null ||
                request.companyName.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Company name is required");
        }

        if (request.startDate == null ||
                request.startDate.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Start date is required");
        }

        if (!request.currentlyWorking &&
                (request.endDate == null ||
                 request.endDate.trim().isEmpty())) {

            return ResponseEntity.badRequest()
                    .body("End date is required unless currently working");
        }

        Experience experience = new Experience();

        copyRequestToExperience(request, experience);

        experience.setUser(user.get());

        Experience saved =
                experienceRepository.save(experience);

        return ResponseEntity.ok(saved);
    }

    // UPDATE experience
    @PutMapping("/{userId}/{experienceId}")
    public ResponseEntity<?> updateExperience(
            @PathVariable Long userId,
            @PathVariable Long experienceId,
            @RequestBody ExperienceRequest request) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Experience> existing =
                experienceRepository.findByIdAndUser(
                        experienceId,
                        user.get()
                );

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (request.jobTitle == null ||
                request.jobTitle.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Job title is required");
        }

        if (request.companyName == null ||
                request.companyName.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Company name is required");
        }

        if (request.startDate == null ||
                request.startDate.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Start date is required");
        }

        if (!request.currentlyWorking &&
                (request.endDate == null ||
                 request.endDate.trim().isEmpty())) {

            return ResponseEntity.badRequest()
                    .body("End date is required unless currently working");
        }

        Experience experience = existing.get();

        copyRequestToExperience(request, experience);

        Experience saved =
                experienceRepository.save(experience);

        return ResponseEntity.ok(saved);
    }

    // DELETE experience
    @DeleteMapping("/{userId}/{experienceId}")
    public ResponseEntity<?> deleteExperience(
            @PathVariable Long userId,
            @PathVariable Long experienceId) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Experience> experience =
                experienceRepository.findByIdAndUser(
                        experienceId,
                        user.get()
                );

        if (experience.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        experienceRepository.delete(experience.get());

        return ResponseEntity.ok(
                "Experience deleted successfully"
        );
    }

    // Copy request data into Experience object
    private void copyRequestToExperience(
            ExperienceRequest request,
            Experience experience) {

        experience.setJobTitle(
                request.jobTitle.trim()
        );

        experience.setCompanyName(
                request.companyName.trim()
        );

        experience.setLocation(
                request.location == null
                        ? ""
                        : request.location.trim()
        );

        experience.setEmploymentType(
                request.employmentType == null
                        ? "Full-time"
                        : request.employmentType.trim()
        );

        experience.setStartDate(
                request.startDate.trim()
        );

        experience.setEndDate(
                request.currentlyWorking
                        ? ""
                        : request.endDate.trim()
        );

        experience.setCurrentlyWorking(
                request.currentlyWorking
        );

        experience.setDescription(
                request.description == null
                        ? ""
                        : request.description.trim()
        );
    }

    // Request body
    public static class ExperienceRequest {

        public String jobTitle;

        public String companyName;

        public String location;

        public String employmentType;

        public String startDate;

        public String endDate;

        public boolean currentlyWorking;

        public String description;
    }
}