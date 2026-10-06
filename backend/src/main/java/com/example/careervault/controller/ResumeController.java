package com.example.careervault.controller;

import com.example.careervault.model.Resume;
import com.example.careervault.model.User;
import com.example.careervault.repository.ResumeRepository;
import com.example.careervault.repository.UserRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/resume")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeController(
            ResumeRepository resumeRepository,
            UserRepository userRepository) {

        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // UPLOAD / REPLACE RESUME
    // ==========================================

    @PostMapping("/{userId}")
    public ResponseEntity<?> uploadResume(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        try {

            Optional<User> optionalUser =
                    userRepository.findById(userId);

            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("User not found");
            }

            User user = optionalUser.get();

            String uploadDir = "uploads";

            File folder = new File(uploadDir);

            if (!folder.exists()) {
                folder.mkdirs();
            }


            // Check existing resume

            Optional<Resume> existingResume =
                    resumeRepository.findByUser(user);

            if (existingResume.isPresent()) {

                File oldFile =
                        new File(
                            existingResume
                                .get()
                                .getFilePath()
                        );

                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }


            String originalFileName =
                    file.getOriginalFilename();

            if (originalFileName == null ||
                originalFileName.isBlank()) {

                return ResponseEntity.badRequest()
                        .body("Invalid file name");
            }


            String fileName =
                    userId + "_" + originalFileName;

            String filePath =
                    uploadDir + "/" + fileName;


            file.transferTo(
                    new File(filePath)
            );


            Resume resume =
                    existingResume
                            .orElse(new Resume());


            resume.setUser(user);

            resume.setFileName(
                    originalFileName
            );

            resume.setFilePath(
                    filePath
            );

            resume.setUploadedAt(
                    LocalDateTime.now()
            );


            Resume savedResume =
                    resumeRepository.save(resume);


            return ResponseEntity.ok(
                    savedResume
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Resume upload failed: "
                        + e.getMessage()
                    );
        }
    }


    // ==========================================
    // GET RESUME DETAILS
    // ==========================================

   @GetMapping("/{userId}")
public ResponseEntity<?> getResume(
        @PathVariable Long userId) {

    Optional<User> user =
            userRepository.findById(userId);

    if (user.isEmpty()) {
        return ResponseEntity.notFound()
                .build();
    }

    return resumeRepository
            .findByUser(user.get())
            .map(ResponseEntity::ok)
            .orElse(
                ResponseEntity.noContent().build()
            );
}

    // ==========================================
    // VIEW RESUME
    // ==========================================

    @GetMapping("/{userId}/view")
    public ResponseEntity<Resource> viewResume(
            @PathVariable Long userId) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }


        Optional<Resume> resume =
                resumeRepository
                        .findByUser(user.get());

        if (resume.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }


        File file =
                new File(
                    resume.get().getFilePath()
                );

        if (!file.exists()) {
            return ResponseEntity.notFound()
                    .build();
        }


        Resource resource =
                new FileSystemResource(file);


        return ResponseEntity.ok()
                .contentType(
                    MediaType.APPLICATION_PDF
                )
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" +
                    resume.get().getFileName() +
                    "\""
                )
                .body(resource);
    }


    // ==========================================
    // DOWNLOAD RESUME
    // ==========================================

    @GetMapping("/{userId}/download")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long userId) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }


        Optional<Resume> resume =
                resumeRepository
                        .findByUser(user.get());

        if (resume.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }


        File file =
                new File(
                    resume.get().getFilePath()
                );

        if (!file.exists()) {
            return ResponseEntity.notFound()
                    .build();
        }


        Resource resource =
                new FileSystemResource(file);


        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" +
                    resume.get().getFileName() +
                    "\""
                )
                .contentType(
                    MediaType.APPLICATION_OCTET_STREAM
                )
                .body(resource);
    }


    // ==========================================
    // DELETE RESUME
    // ==========================================

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteResume(
            @PathVariable Long userId) {

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }


        Optional<Resume> resume =
                resumeRepository
                        .findByUser(user.get());

        if (resume.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }


        try {

            File file =
                    new File(
                        resume.get().getFilePath()
                    );

            if (file.exists()) {
                file.delete();
            }


            resumeRepository.delete(
                    resume.get()
            );


            return ResponseEntity.ok(
                    "Resume deleted successfully"
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Could not delete resume"
                    );
        }
    }
}