package com.ticketdesk.config;

import com.ticketdesk.entity.User;
import com.ticketdesk.enums.Role;
import com.ticketdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Automatically seeds default application users for each role on startup if missing.
 * Idempotent seeder that uses BCrypt password encoding.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_PASSWORD = "TicketDesk@123";

    @Override
    @Transactional
    public void run(final String... args) {
        log.info("Checking system user initialization...");

        seedUserIfMissing(
                "admin",
                "admin@ticketdesk.com",
                "TicketDesk",
                "Admin",
                "9876543210",
                "IT Administration",
                Role.ADMIN
        );

        seedUserIfMissing(
                "support",
                "support@ticketdesk.com",
                "Support",
                "Engineer",
                "8765432109",
                "Technical Support",
                Role.SUPPORT_ENGINEER
        );

        seedUserIfMissing(
                "employee",
                "employee@ticketdesk.com",
                "Employee",
                "User",
                "7654321098",
                "Human Resources",
                Role.EMPLOYEE
        );
    }

    private void seedUserIfMissing(
            final String username,
            final String email,
            final String firstName,
            final String lastName,
            final String phone,
            final String department,
            final Role role
    ) {
        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            log.info("Default user for role [{}] already exists ({}/{}). Skipping creation.", role, username, email);
            return;
        }

        final User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .phone(phone)
                .department(department)
                .role(role)
                .active(true)
                .build();

        userRepository.save(user);
        log.info("Successfully seeded default user for role [{}] -> Username: {}, Email: {}", role, username, email);
    }
}
