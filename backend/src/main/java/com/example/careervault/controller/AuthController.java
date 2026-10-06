package com.example.careervault.controller;

import com.example.careervault.model.User;
import com.example.careervault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerOrLoginUser(@RequestBody User incomingUser) {
        // Check if a user with this email already exists in the database
        User existingUser = userRepository.findByEmail(incomingUser.getEmail());

        if (existingUser != null) {
            // If they exist, log them in
            return ResponseEntity.ok(new AuthResponse("Welcome back! Login successful.", existingUser));
        }

        // If they don't exist, save them as a new user
        User savedUser = userRepository.save(incomingUser);
        return ResponseEntity.status(201).body(new AuthResponse("Signup successful!", savedUser));
    }

    // A simple helper class to format our JSON response sent back to React
    public static class AuthResponse {
        private String message;
        private User user;

        public AuthResponse(String message, User user) {
            this.message = message;
            this.user = user;
        }

        public String getMessage() { return message; }
        public User getUser() { return user; }
    }
}