package com.fullstack.app1.config;

import com.fullstack.app1.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fullstack.app1.entity.User;
import com.fullstack.app1.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements CommandLineRunner {

    private final UserRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (memberRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("1234")); // 기본 비밀번호
            admin.setRole("ADMIN");
            admin.setEmail("admin@example.com");
            memberRepository.save(admin);
            System.out.println("✅ 기본 관리자 계정 생성 완료");
        }
    }
}
