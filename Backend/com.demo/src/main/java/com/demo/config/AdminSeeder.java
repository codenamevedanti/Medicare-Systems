// src/main/java/com/demo/config/AdminSeeder.java
package com.demo.config;

import com.demo.model.User;
import com.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@hospital.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setUsername(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123")); 
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("✅ Admin user created");
        } else {
            // Update existing admin's password properly
            User admin = userRepository.findByEmail(adminEmail).get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("✅ Admin password reset");
        }
    }
}