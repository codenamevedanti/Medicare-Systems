package com.demo.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * ChatController — REST controller for the Ratnadeep Hospital AI chatbot.
 *
 * Uses the Groq API (https://console.groq.com) with the LLaMA 3.3 70B model.
 *
 * Endpoint: POST /api/chat
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    /**
     * Groq API key injected from application-local.properties.
     */
    @Value("${groq.api.key}")
    private String groqApiKey;

    /**
     * Groq API endpoint using the LLaMA 3.3 70B model.
     * Groq uses the OpenAI-compatible /chat/completions format.
     * Other available models: llama-3.1-8b-instant, mixtral-8x7b-32768
     */
    private static final String GROQ_URL =
        "https://api.groq.com/openai/v1/chat/completions";

    private static final String MODEL = "llama-3.3-70b-versatile";

    /**
     * System prompt — defines the AI's identity and knowledge base.
     *
     * This is sent with every request as a "system" role message.
     * It tells the AI who it is, what it knows, and how to behave.
     * The AI will only answer hospital-related questions based on this context.
     */
    private static final String SYSTEM_PROMPT =
        "You are the official AI assistant for Ratnadeep Hospital, a multi-specialty hospital located in Pune, Maharashtra. " +
        "Answer ONLY questions related to the hospital. Be concise, warm, and helpful. " +
        "\n\n" +
        "HOSPITAL INFO:\n" +
        "Name: Ratnadeep Hospital\n" +
        "Address: Mg Road,Shivajinagar, Pune, Maharashtra\n" +
        "Phone: 0712-2565555 | Helpline: 1800-222-108\n" +
        "Ambulance: 102 | Emergency: 0712-2565500\n" +
        "\n" +
        "OPD TIMINGS:\n" +
        "- General OPD: Mon-Sat 9:00 AM - 1:00 PM and 5:00 PM - 8:00 PM\n" +
        "- Sunday OPD: 9:00 AM - 12:00 PM (Emergency only)\n" +
        "- Specialist OPD: By appointment, Mon-Sat 10:00 AM - 2:00 PM\n" +
        "\n" +
        "DEPARTMENTS:\n" +
        "1. Cardiology\n2. Orthopedics\n3. Neurology\n4. Pediatrics\n" +
        "5. Gynecology & Obstetrics\n6. General Surgery\n7. ENT\n" +
        "8. Dermatology\n9. Ophthalmology\n10. Oncology\n11. Emergency & Trauma (24/7)\n" +
        "\n" +
        "FACILITIES: 24/7 Emergency, ICU & NICU, Dialysis, Blood Bank, Pharmacy (24/7), " +
        "Radiology (X-Ray, MRI, CT Scan, Ultrasound), Pathology Lab, Physiotherapy, Ambulance.\n" +
        "\n" +
        "APPOINTMENTS: Call 0712-2565555 or walk-in for General OPD.\n" +
        "INSURANCE: Ayushman Bharat, CGHS, ECHS, and major TPAs.\n" +
        "\n" +
        "If asked anything unrelated to the hospital, politely say you can only help with hospital-related queries.";

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/chat/debug
     */
    @GetMapping("/debug")
    public ResponseEntity<Map<String, String>> debug() {
        boolean keyLoaded = groqApiKey != null
                            && !groqApiKey.isBlank()
                            && !groqApiKey.equals("${GROQ_API_KEY}");
        return ResponseEntity.ok(Map.of(
            "apiKeyLoaded", String.valueOf(keyLoaded),
            "apiKeyPreview", keyLoaded
                ? groqApiKey.substring(0, 8) + "..."
                : "EMPTY — check application-local.properties"
        ));
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * POST /api/chat
     *
     * Main chatbot endpoint. Receives the user's message, sends it to the
     * Groq API along with the hospital system prompt, and returns the AI reply.
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");

        // Reject empty or blank messages before hitting the API
        if (userMessage == null || userMessage.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Message cannot be empty"));
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            // ── Build the Groq request body ───────────────────────────────
            // Groq uses OpenAI's chat format: an array of role-based messages.
            // "system" role = instructions/context for the AI (our hospital info)
            // "user"   role = the actual question from the patient/visitor

            Map<String, Object> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", SYSTEM_PROMPT);

            Map<String, Object> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", userMessage);

            Map<String, Object> body = new HashMap<>();
            body.put("model", MODEL);
            body.put("messages", List.of(systemMessage, userMsg));
            // max_tokens limits response length — 500 is enough for concise answers
            body.put("max_tokens", 500);

            // ── Set request headers ───────────────────────────────────────
            // Groq requires the API key in the Authorization header (Bearer token),
            // unlike Gemini which takes it as a URL query parameter (?key=...)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + groqApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // ── Call the Groq API ─────────────────────────────────────────
            System.out.println(">>> Calling Groq API with model: " + MODEL);
            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, entity, Map.class);
            System.out.println(">>> Groq status: " + response.getStatusCode());

            // ── Parse and return the response ─────────────────────────────
            String reply = extractGroqText(response.getBody());
            System.out.println(">>> Groq reply preview: " +
                (reply != null ? reply.substring(0, Math.min(80, reply.length())) : "null"));

            return ResponseEntity.ok(Map.of("reply", reply));

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // Groq returned a 4xx error (bad key, quota, invalid request, etc.)
            // Full error details are printed to the Eclipse console for debugging
            System.err.println(">>> Groq 4xx error: " + e.getResponseBodyAsString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("reply",
                    "AI service error. Please call 0712-2565555 for assistance."));

        } catch (Exception e) {
            // Catch-all for network errors, timeouts, parsing failures, etc.
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("reply",
                    "I'm having trouble connecting right now. " +
                    "For urgent help, please call: 1800-222-108 or Ambulance: 102"));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────

    /*
     * Returns a fallback message if parsing fails for any reason.
     */
    @SuppressWarnings("unchecked")
    private String extractGroqText(Map responseBody) {
        try {
            // Navigate: choices[0] -> message -> content
            List<Map> choices = (List<Map>) responseBody.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map message = (Map) choices.get(0).get("message");
                if (message != null) {
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            // Log parsing errors to console for debugging
            System.err.println(">>> Failed to parse Groq response: " + e.getMessage());
            e.printStackTrace();
        }
        // Fallback if parsing fails — always give the user a way to get help
        return "Sorry, I couldn't process your request. Please call 0712-2565555 for assistance.";
    }
}