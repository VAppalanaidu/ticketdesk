package com.ticketdesk.service.impl;

import com.ticketdesk.dto.request.RegisterRequest;
import com.ticketdesk.dto.request.UpdateUserRequest;
import com.ticketdesk.dto.response.UserResponse;
import com.ticketdesk.entity.User;
import com.ticketdesk.enums.Role;
import com.ticketdesk.exception.BadRequestException;
import com.ticketdesk.exception.DuplicateResourceException;
import com.ticketdesk.exception.ResourceNotFoundException;
import com.ticketdesk.mapper.UserMapper;
import com.ticketdesk.repository.UserRepository;
import com.ticketdesk.service.UserService;
import com.ticketdesk.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper      userMapper;
    private final SecurityUtils   securityUtils;

    @Override
    @Transactional
    public UserResponse createUser(final RegisterRequest request) {
        log.info("Creating user: {}", request.getUsername());

        // Restrict manual creation of ADMIN accounts
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Manual creation of ADMIN role is restricted. Only Support Engineers can be added.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered");
        }

        final Role targetRole = request.getRole() != null ? request.getRole() : Role.SUPPORT_ENGINEER;

        final User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .department(request.getDepartment())
                .role(targetRole)
                .active(true)
                .build();

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(final Long userId, final UpdateUserRequest request) {
        log.info("Updating user with id: {}", userId);

        final User user = getUserEntityById(userId);

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Promoting user to ADMIN role is restricted.");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(final Long userId) {
        log.info("Deleting user with id: {}", userId);

        final User current = securityUtils.getCurrentUser();
        if (current.getId().equals(userId)) {
            throw new BadRequestException("You cannot delete your own account");
        }

        final User user = getUserEntityById(userId);
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("System ADMIN account cannot be deleted");
        }
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(final Long userId) {
        return userMapper.toResponse(getUserEntityById(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(final Pageable pageable) {
        // Exclude ADMIN users from User Directory
        return userRepository.findByRoleNot(Role.ADMIN, pageable).map(userMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> searchUsers(final String search,
                                          final Role role,
                                          final Boolean active,
                                          final Pageable pageable) {
        // Exclude ADMIN users from search results
        return userRepository.searchUsersExcludingAdmin(search, role, active, pageable).map(userMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getSupportEngineers() {
        return userRepository.findByRoleAndActive(Role.SUPPORT_ENGINEER, true)
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public UserResponse activateUser(final Long userId) {
        log.info("Activating user with id: {}", userId);
        final User user = getUserEntityById(userId);
        if (user.isActive()) {
            throw new BadRequestException("User is already active");
        }
        user.setActive(true);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse deactivateUser(final Long userId) {
        log.info("Deactivating user with id: {}", userId);
        final User current = securityUtils.getCurrentUser();
        if (current.getId().equals(userId)) {
            throw new BadRequestException("You cannot deactivate your own account");
        }
        final User user = getUserEntityById(userId);
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("System ADMIN account cannot be deactivated");
        }
        if (!user.isActive()) {
            throw new BadRequestException("User is already inactive");
        }
        user.setActive(false);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile() {
        return userMapper.toResponse(securityUtils.getCurrentUser());
    }

    // ===== Private Helpers =====

    private User getUserEntityById(final Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}
