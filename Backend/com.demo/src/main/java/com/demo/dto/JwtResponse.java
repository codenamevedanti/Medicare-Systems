package com.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String username;
    private String role;
    private String type = "Bearer";

    public JwtResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }
}