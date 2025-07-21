package com.fullstack.app1.controller;

import com.fullstack.app1.entity.User;
import com.fullstack.app1.repository.UserRepository;
import com.fullstack.app1.service.UserService;
import com.fullstack.app1.storage.VerifiedEmailStorage;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final VerifiedEmailStorage verifiedEmailStorage;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (!verifiedEmailStorage.isVerified(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 인증이 필요합니다.");
        }

        verifiedEmailStorage.remove(user.getEmail());
        return ResponseEntity.ok(userService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        User user = userService.login(credentials.get("username"), credentials.get("password"));
        if (user != null) {
            session.setAttribute("loginUser", user);
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out");
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        userService.deleteUserById(user.getId());
        session.invalidate();
        return ResponseEntity.ok("회원 탈퇴 완료");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("tel", user.getTel());
        result.put("address", user.getAddress());
        result.put("role", user.getRole());
        result.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "가입일 없음");

        return ResponseEntity.ok(result);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateUserInfo(@RequestBody User updated, HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        loginUser.setName(updated.getName());
        loginUser.setTel(updated.getTel());
        loginUser.setAddress(updated.getAddress());

        if (updated.getEmail() != null && !updated.getEmail().equals(loginUser.getEmail())) {
            if (!verifiedEmailStorage.isVerified(updated.getEmail())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 인증이 필요합니다.");
            }
            loginUser.setEmail(updated.getEmail());
            verifiedEmailStorage.remove(updated.getEmail());
        }

        userRepository.save(loginUser);
        session.setAttribute("loginUser", loginUser);


        return ResponseEntity.ok("updated");
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("삭제 완료");
    }

    @GetMapping("/check-social")
    public ResponseEntity<?> checkSocial(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return ResponseEntity.ok(Map.of("social", user.map(User::isSocial).orElse(false)));
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userRepository.existsByUsername(username);
        return ResponseEntity.ok(Map.of("available", !exists));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("available", !exists));
    }
}
