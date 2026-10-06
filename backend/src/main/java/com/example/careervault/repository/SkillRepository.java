package com.example.careervault.repository;

import com.example.careervault.model.Skill;
import com.example.careervault.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository
        extends JpaRepository<Skill, Long> {

    List<Skill> findByUser(User user);
}