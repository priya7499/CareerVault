package com.example.careervault.repository;

import com.example.careervault.model.Resume;
import com.example.careervault.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    Optional<Resume> findByUser(User user);

    void deleteByUser(User user);
}