package com.fullstack.app1.config;

import com.fullstack.app1.entity.User;
import com.fullstack.app1.repository.UserRepository;
import com.fullstack.app1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DummyUserInitializer implements CommandLineRunner {

    private final UserService userService;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {

        // 기존 더미 사용자 제거
        // userService.deleteDummyUsers();

        for (int i = 1; i <= 50; i++) {
            String username = "user" + i;
            String email = "user" + i + "@example.com";
            String password = "1234"; // 암호화는 UserService에서 처리
            String name = "사용자" + i;
            String tel = String.format("010-1234-%04d", i);
            String address = "서울시 어딘가 " + i + "길";

            // ✅ 중복된 이메일이면 건너뜀
            if (userRepository.findByEmail(email).isPresent()) continue;

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setName(name);
            user.setTel(tel);
            user.setAddress(address);
            user.setRole("USER");
            user.setSocial(false);

            userService.register(user);
        }
    }


}
