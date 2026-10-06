package com.example.careervault.controller;

import com.example.careervault.model.Skill;
import com.example.careervault.model.User;
import com.example.careervault.repository.SkillRepository;
import com.example.careervault.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/skills")
@CrossOrigin(origins = "http://localhost:5173")
public class SkillController {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillController(
            SkillRepository skillRepository,
            UserRepository userRepository) {

        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // GET USER SKILLS
    // ==========================================

    @GetMapping("/{userId}")
    public ResponseEntity<?> getSkills(
            @PathVariable Long userId) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }

        List<Skill> skills =
                skillRepository.findByUser(
                        user.get()
                );

        return ResponseEntity.ok(skills);
    }


    // ==========================================
    // ADD SKILL
    // ==========================================

    @PostMapping("/{userId}")
    public ResponseEntity<?> addSkill(
            @PathVariable Long userId,
            @RequestBody SkillRequest request) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }

        if (request.name == null ||
            request.name.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Skill name is required");
        }


        Skill skill = new Skill();

        skill.setName(
                request.name.trim()
        );

        skill.setUser(
                user.get()
        );


        Skill saved =
                skillRepository.save(skill);


        return ResponseEntity.ok(saved);
    }


    // ==========================================
    // DELETE SKILL
    // ==========================================

    @DeleteMapping("/{skillId}")
    public ResponseEntity<?> deleteSkill(
            @PathVariable Long skillId) {

        Optional<Skill> skill =
                skillRepository.findById(skillId);

        if (skill.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }

        skillRepository.delete(
                skill.get()
        );

        return ResponseEntity.ok(
                "Skill deleted successfully"
        );
    }


    // ==========================================
    // REQUEST BODY
    // ==========================================

    public static class SkillRequest {

        public String name;
    }
}