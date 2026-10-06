package com.example.careervault.repository;

import com.example.careervault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // This allows us to find a user by their email during login
    User findByEmail(String email);
}