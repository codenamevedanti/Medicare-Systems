package com.demo.service;

import com.demo.dto.JwtResponse;
import com.demo.dto.LoginRequest;
import com.demo.model.Patient;
import com.demo.model.User;
import com.demo.repository.PatientRepository;
import com.demo.repository.UserRepository;
import com.demo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PatientRepository patientRepository; 

    // Login — unchanged
    public JwtResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return new JwtResponse(token, user.getUsername(), user.getRole().name());
        } catch (BadCredentialsException e) {
        	throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
    }

    // Register — NOW ALSO CREATES PATIENT RECORD
    public User register(User user) {
    	 if (user.getUsername() == null || user.getUsername().isEmpty()) {
    	        if (user.getPhone() != null && !user.getPhone().isEmpty()) {
    	            user.setUsername(user.getPhone()); 
    	        } else {
    	            user.setUsername(user.getEmail()); 
    	        }
    	    }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (user.getEmail() != null && !user.getEmail().isEmpty() 
                && userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("Password cannot be null");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);
        if (user.getRole() == null) {
            user.setRole(User.Role.PATIENT);
        }
        User savedUser = userRepository.save(user); // ← save user first

        // ── CREATE PATIENT RECORD LINKED TO THIS USER ──
        Patient patient = new Patient();
        patient.setUserId(savedUser.getId());
        patient.setFirstName(user.getFirstName() != null ? user.getFirstName() : "");
        patient.setLastName(user.getLastName() != null ? user.getLastName() : "");
        patient.setPhone(user.getPhone());
        patient.setEmail(user.getEmail());
        patient.setActive(true);
        patientRepository.save(patient);

        return savedUser;
    }

    // Change password — unchanged
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Get user by username — unchanged
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    // Deactivate user — unchanged
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }
    
     // you type "mypassword123" → auto BCrypt
    public String registerAdmin(String plainPassword) {
        return passwordEncoder.encode(plainPassword); 
    }
}