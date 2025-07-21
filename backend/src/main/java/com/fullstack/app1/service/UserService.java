package com.fullstack.app1.service;

import com.fullstack.app1.entity.User;
import com.fullstack.app1.repository.ChatRoomRepository;
import com.fullstack.app1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // ✅ 추가
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final PasswordEncoder passwordEncoder; // ✅ 추가

    public User register(User user) {
        // ✅ 비밀번호 암호화
        String rawPassword = user.getPassword();
        String encoded = passwordEncoder.encode(rawPassword);
        user.setPassword(encoded);

        return userRepository.save(user);
    }

    public User login(String username, String password) {
        // ✅ 해시 비교
        return userRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .orElse(null);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByStringId(String userId) {
        try {
            Long id = Long.parseLong(userId);
            return userRepository.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUserById(Long userId) {
        chatRoomRepository.deleteByUser1IdOrUser2Id(userId, userId); // ✅ 사용자 관련 채팅방 삭제
        userRepository.deleteById(userId);
    }

    public User findOrCreateUserByEmail(String email, String name) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User newUser = new User();
        newUser.setUsername(name);
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setTel("");
        newUser.setAddress("");
        newUser.setPassword(""); // 소셜 로그인은 비번 없이
        newUser.setRole("USER");
        newUser.setSocial(true);

        return userRepository.save(newUser);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public void deleteDummyUsers() {
        List<User> dummyUsers = userRepository.findAll().stream()
                .filter(u -> u.getUsername().startsWith("user")) // user1 ~ user50
                .toList();

        dummyUsers.forEach(user -> {
            chatRoomRepository.deleteByUser1IdOrUser2Id(user.getId(), user.getId()); // 연관 채팅방 삭제
            userRepository.deleteById(user.getId());
        });
    }

}
