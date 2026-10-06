package com.example.careervault.repository;

import com.example.careervault.model.Experience;
import com.example.careervault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    List<Experience> findByUser(User user);

    Optional<Experience> findByIdAndUser(Long id, User user);
}