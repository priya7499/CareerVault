package com.example.careervault.controller;

import com.example.careervault.model.User;
import com.example.careervault.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET PROFILE
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {

        System.out.println("Getting profile for user ID: " + userId);

        return userRepository.findById(userId)
                .map(user -> {
                    System.out.println("User found: " + user.getUsername());
                    return ResponseEntity.ok(user);
                })
                .orElseGet(() -> {
                    System.out.println("User NOT found!");
                    return ResponseEntity.notFound().build();
                });
    }


    // UPDATE PROFILE
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody User updatedUser) {

                updatedUser.setResumeHeadline(updatedUser.getResumeHeadline());

        System.out.println("=================================");
        System.out.println("UPDATE PROFILE");
        System.out.println("User ID: " + userId);

        System.out.println("Username: " + updatedUser.getUsername());
        System.out.println("Email: " + updatedUser.getEmail());
        System.out.println("Phone: " + updatedUser.getPhone());
        System.out.println("Location: " + updatedUser.getLocation());
        System.out.println("Date of Birth: " + updatedUser.getDateOfBirth());
        System.out.println("LinkedIn: " + updatedUser.getLinkedin());
        System.out.println("GitHub: " + updatedUser.getGithub());

        System.out.println("=================================");


        return userRepository.findById(userId)
                .map(user -> {

                    user.setUsername(updatedUser.getUsername());
                    user.setEmail(updatedUser.getEmail());

                    user.setPhone(updatedUser.getPhone());
                    user.setLocation(updatedUser.getLocation());
                    user.setDateOfBirth(updatedUser.getDateOfBirth());
                    user.setLinkedin(updatedUser.getLinkedin());
                    user.setGithub(updatedUser.getGithub());
                    

                    User savedUser = userRepository.save(user);

                    System.out.println("USER SAVED SUCCESSFULLY");
                    System.out.println("Saved phone: " + savedUser.getPhone());
                    System.out.println("Saved location: " + savedUser.getLocation());

                    return ResponseEntity.ok(savedUser);
                })
                .orElseGet(() -> {

                    System.out.println("USER ID NOT FOUND: " + userId);

                    return ResponseEntity.notFound().build();
                });
    }
}