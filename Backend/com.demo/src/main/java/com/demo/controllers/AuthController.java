package com.demo.controllers;

import com.demo.dto.LoginRequest;
import com.demo.dto.JwtResponse;
import com.demo.model.User;
import com.demo.repository.UserRepository;
import com.demo.security.JwtTokenProvider;
import com.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    
    private final AuthService authService;           // handles business logic (login, register, etc.)
    private final UserRepository userRepository;     // direct DB access for user lookups
    private final JwtTokenProvider jwtTokenProvider; // generates and reads JWT tokens

    // ─────────────────────────────────────────────────────────────────
    // POST /api/auth/login
    // Accepts username + password, returns JWT token if valid
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        // Delegates to AuthService which uses AuthenticationManager internally
        // If credentials are wrong, AuthService throws RuntimeException → caught by global handler
        return ResponseEntity.ok(authService.login(request));
    }

    // ─────────────────────────────────────────────────────────────────
    // POST /api/auth/register
    // Accepts a User object in request body, registers them as PATIENT by default
    // Also auto-creates a linked Patient record (done inside AuthService)
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
    	System.out.println("=== REGISTER DEBUG ===");
        System.out.println("firstName: " + user.getFirstName());
        System.out.println("phone: " + user.getPhone());
        System.out.println("password: " + user.getPassword()); // check this
        System.out.println("email: " + user.getEmail());
        
        try {
            // AuthService handles: password encoding, default role, duplicate checks
            return ResponseEntity.ok(authService.register(user));
        } catch (DataIntegrityViolationException e) {
            // Triggered when DB unique constraint is violated (e.g. duplicate phone/email at DB level)
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message",
                    "An account with this phone number or email already exists."));
        } catch (RuntimeException e) {
            // Triggered by manual checks in AuthService (e.g. "Username already taken")
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // PUT /api/auth/change-password/{userId}
    // Allows a logged-in user to change their own password
    // Requires old password verification before updating
    // ─────────────────────────────────────────────────────────────────
    @PutMapping("/change-password/{userId}")
    public ResponseEntity<String> changePassword(
            @PathVariable Long userId,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        // AuthService verifies old password matches before encoding and saving new one
        authService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok("Password changed successfully");
    }

    // ─────────────────────────────────────────────────────────────────
    // PUT /api/auth/deactivate/{userId}
    // Soft-deletes a user by setting active = false
    // User record stays in DB but they cannot log in (if your security checks active flag)
    // ─────────────────────────────────────────────────────────────────
    @PutMapping("/deactivate/{userId}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long userId) {
        authService.deactivateUser(userId);
        return ResponseEntity.ok("User deactivated successfully");
    }

    // ─────────────────────────────────────────────────────────────────
    // GET /api/auth/me
    // Returns the currently logged-in user's details
    // Reads the JWT from Authorization header, extracts username, fetches user from DB
    // ─────────────────────────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        // Strip "Bearer " prefix to get the raw JWT token string
        String token = authHeader.replace("Bearer ", "");

        // Decode the token to get the username stored inside it
        String username = jwtTokenProvider.getUsernameFromToken(token);

        // Fetch full user object from DB using that username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    // ─────────────────────────────────────────────────────────────────
    // POST /api/auth/create-admin
    // One-time use endpoint to manually create an ADMIN user
    // Accepts JSON body: { "email": "...", "password": "..." }
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String plainPassword = body.get("password");

            // Prevent creating duplicate admin with the same email
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.ok(
                    Map.of("message", "Admin already exists! Just login with your credentials."));
            }

            User admin = new User();
            admin.setEmail(email);
            admin.setUsername(email); // username = email for admin accounts

            
            admin.setPassword(authService.registerAdmin(plainPassword));

            
            admin.setRole(User.Role.ADMIN);

            admin.setActive(true); // make sure admin can log in immediately

            userRepository.save(admin); // persist to DB

            return ResponseEntity.ok(
                Map.of("message", "✅ Admin created! Login with: " + email + " / " + plainPassword));
        } catch (Exception e) {
            // Catch any unexpected errors (DB issues, null values, etc.)
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}