package com.demo.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.demo")
@EntityScan("com.demo.model")
@EnableJpaRepositories("com.demo.repository")
public class HmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(HmsApplication.class, args);
    }
}