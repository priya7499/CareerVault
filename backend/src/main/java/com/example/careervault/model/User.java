package com.example.careervault.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true)
    private String email;

    private String password;

    private String phone;

    private String location;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    private String linkedin;

    private String github;

    private String resumeHeadline;
}