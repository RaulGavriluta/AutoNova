package com.autonova.backend.controller;

import com.autonova.backend.dto.AuthResponse;
import com.autonova.backend.dto.LoginRequest;
import com.autonova.backend.dto.RegisterRequest;
import com.autonova.backend.dto.TokenRefreshRequest;
import com.autonova.backend.model.RefreshToken;
import com.autonova.backend.model.User;
import com.autonova.backend.security.JwtService;
import com.autonova.backend.security.RefreshTokenService;
import com.autonova.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @Autowired
    public UserController(UserService userService, RefreshTokenService refreshTokenService, JwtService jwtService) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = userService.registerUser(request);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint: POST /api/auth/refresh
     * React triggers this automatically when the 15-minute Access Token expires.
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtService.generateAccessToken(user);
                    return ResponseEntity.ok(new AuthResponse(
                            newAccessToken,
                            request.getRefreshToken(),
                            user.getId(),
                            user.getEmail(),
                            user.getRole()
                    ));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}