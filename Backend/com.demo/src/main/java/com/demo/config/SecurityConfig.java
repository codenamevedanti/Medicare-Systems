package com.demo.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.demo.security.CustomUserDetailsService;
import com.demo.security.JwtAuthenticationFilter;

/**
 * SecurityConfig — Central security configuration for the HMS REST API.
 *
 * Responsibilities:
 *  1. Define which endpoints are public vs protected
 *  2. Set up JWT-based stateless authentication (no sessions/cookies)
 *  3. Configure CORS so the React frontend (localhost:5173) can call our API
 *  4. Wire up the password encoder and authentication provider
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // JWT filter that reads the "Authorization: Bearer <token>" header
    // and validates it before every request reaches any controller
    private final JwtAuthenticationFilter jwtAuthFilter;

    // Our custom implementation of UserDetailsService
    // Loads user data from the database by email/username
    private final CustomUserDetailsService userDetailsService;

    // Constructor injection — preferred over @Autowired for testability
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    /**
     * filterChain — Defines the HTTP security rules for the application.
     *
     * This is the main security configuration method. It controls:
     *  - Which endpoints require authentication
     *  - Which roles can access which endpoints
     *  - Session management strategy (stateless for JWT)
     *  - Where the JWT filter sits in the filter chain
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS using our corsConfigurationSource() bean defined below.
            // This allows the React frontend at localhost:5173 to make API calls.
            .cors().and()

            // Disable CSRF protection — not needed for stateless REST APIs.
            // CSRF attacks exploit session cookies; since we use JWT (not cookies),
            // CSRF is not a threat here.
            .csrf().disable()

            // Use STATELESS session management — Spring will NOT create or use
            // HTTP sessions. Every request must include a valid JWT token.
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()

            // ─── ENDPOINT ACCESS RULES ───────────────────────────────────────
            // Rules are evaluated TOP TO BOTTOM — first match wins.
            // Always put more specific rules BEFORE broader ones.
            .authorizeRequests()

                // ✅ AUTH — Login and Register endpoints are always public.
                // Users need to access these before they have a token.
                .antMatchers("/api/auth/**").permitAll()

                // ✅ CHAT — AI hospital assistant is public.
                // Uses "/**" wildcard to cover both:
                //   POST /api/chat        → main chat endpoint
                //   GET  /api/chat/debug  → debug/health check endpoint
                 .antMatchers("/api/chat/**").permitAll()
                 

                // ✅ PATIENTS by-user — public so the frontend can fetch
                // a patient's profile immediately after login, before
                // attaching the token to subsequent requests.
                .antMatchers("/api/patients/by-user/**").permitAll()
                

                // 🔒 PATIENTS — any authenticated user can access patient data.
                // Covers doctors viewing patient records, patients viewing their own.
                .antMatchers("/api/patients/**").authenticated()

                // ✅ DEPARTMENTS — read-only access is public (patients can browse).
                // Write operations (create/update/delete) are restricted to ADMIN.
                .antMatchers(HttpMethod.GET,    "/api/departments/**").permitAll()
                .antMatchers(HttpMethod.POST,   "/api/departments/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT,    "/api/departments/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/departments/**").hasRole("ADMIN")

                // ✅ LABS — same pattern as departments.
                // Public read, ADMIN-only write.
                .antMatchers(HttpMethod.GET,    "/api/labs/**").permitAll()
                .antMatchers(HttpMethod.POST,   "/api/labs/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT,    "/api/labs/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/labs/**").hasRole("ADMIN")

                // ✅ DOCTORS — patients can browse the doctor list without logging in.
                // Only ADMIN can add, update, or remove doctor records.
                .antMatchers(HttpMethod.GET,    "/api/doctors/**").permitAll()
                .antMatchers(HttpMethod.POST,   "/api/doctors/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT,    "/api/doctors/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/doctors/**").hasRole("ADMIN")

                // ADMIN panel — full access for ADMIN role only.
                // No patient or doctor should reach these endpoints.
                .antMatchers("/api/admin/**").hasRole("ADMIN")

                //  BILLING — any logged-in user can access billing records.
                // Frontend filters data by patient/doctor on the service layer.
                .antMatchers("/api/billing/**").authenticated()

                // APPOINTMENTS — any logged-in user can manage appointments.
                .antMatchers("/api/appointments/**").authenticated()

                // PRESCRIPTIONS — any logged-in user can view/create prescriptions.
                .antMatchers("/api/prescriptions/**").authenticated()

                // PHARMACY & MEDICINES — requires login.
                .antMatchers("/api/pharmacy/**").authenticated()
                .antMatchers("/api/medicines/**").authenticated()

                // VITALS — requires login (admin/doctor adds, patient views).
                .antMatchers("/api/vitals/**").authenticated()

                // 🔒 CATCH-ALL — any endpoint not listed above requires authentication.
                // This is a safe default — unknown endpoints are protected by default.
                .anyRequest().authenticated();

        // ─── JWT FILTER REGISTRATION ─────────────────────────────────────────
        // Insert our JwtAuthenticationFilter BEFORE Spring's default
        // UsernamePasswordAuthenticationFilter in the filter chain.
        // This means JWT validation happens first on every incoming request.
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * authenticationProvider — Connects our UserDetailsService and PasswordEncoder
     * to Spring Security's authentication system.
     *
     * Spring calls this when verifying login credentials:
     *  1. Loads the user from DB via CustomUserDetailsService
     *  2. Compares the submitted password against the stored BCrypt hash
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * passwordEncoder — BCrypt password hashing bean.
     *
     * BCrypt is the industry standard for password hashing:
     *  - Automatically salts passwords (prevents rainbow table attacks)
     *  - Adaptive cost factor (can be made slower as hardware improves)
     * Used both when saving new passwords and verifying login attempts.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * authenticationManager — Exposes Spring's AuthenticationManager as a bean.
     *
     * Required by AuthController to programmatically authenticate users during login.
     * Spring Security auto-configures this based on our authenticationProvider() bean.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * corsConfigurationSource — Defines CORS policy for the entire application.
     *
     * CORS (Cross-Origin Resource Sharing) controls which external origins
     * are allowed to call our API. Without this, the browser blocks requests
     * from our React frontend (localhost:5173) to our API (localhost:8081).
     *
     * Why not just use @CrossOrigin on controllers?
     *  - @CrossOrigin on individual controllers is fragmented and error-prone.
     *  - A global CORS config here applies consistently to ALL endpoints,
     *    including the Spring Security filter chain (which runs before controllers).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Only allow requests from our React frontend.
        // For production, replace with the actual deployed frontend URL.
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        // Allow standard REST methods + OPTIONS (required for CORS preflight requests).
        // Browsers send an OPTIONS "preflight" request before POST/PUT to check permissions.
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all request headers, including:
        //  - "Authorization" for JWT tokens
        //  - "Content-Type" for JSON bodies
        config.setAllowedHeaders(Arrays.asList("*"));

        // Allow credentials (cookies, Authorization headers) to be included in requests.
        // Required for JWT token transmission from the frontend.
        config.setAllowCredentials(true);

        // Apply this CORS configuration to every endpoint in the application.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}