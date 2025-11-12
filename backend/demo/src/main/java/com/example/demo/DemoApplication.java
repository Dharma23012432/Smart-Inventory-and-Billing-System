package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // ✅ Make sure there's NO exclude here
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        System.out.println("Prefer IPv4: " + System.getProperty("java.net.preferIPv4Stack"));
    }
}
