package com.fullstack.app1.service;

import com.fullstack.app1.entity.ChatRoom;
import com.fullstack.app1.entity.User;
import com.fullstack.app1.repository.ChatRoomRepository;
import com.fullstack.app1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChattingRoomService {

    private final ChatRoomRepository chatRoomRepo;
    private final UserRepository userRepo;

    // 고객 ↔ 관리자 채팅 전용
    public ChatRoom createOrFindRoomWithAdmin(Long userId) {
        User customer = userRepo.findById(userId).orElseThrow();
        User admin = userRepo.findByRole("ADMIN")
                .orElseThrow(() -> new RuntimeException("관리자 계정이 없습니다."));

        return chatRoomRepo.findByUser1AndUser2(customer, admin)
                .or(() -> chatRoomRepo.findByUser2AndUser1(customer, admin))
                .orElseGet(() -> {
                    ChatRoom room = new ChatRoom();
                    room.setUser1(customer);
                    room.setUser2(admin);
                    return chatRoomRepo.save(room);
                });
    }

    // 고객 → 내가 속한 방 조회
    public List<ChatRoom> getRoomsForUser(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return chatRoomRepo.findByUser1OrUser2(user, user);
    }

    // 관리자 → 모든 고객 방 조회
    public Page<ChatRoom> getAllRoomsForAdmin(Pageable pageable) {
        User admin = userRepo.findByRole("ADMIN").orElseThrow();
        return chatRoomRepo.findAllByAdmin(admin, pageable);
    }
}

