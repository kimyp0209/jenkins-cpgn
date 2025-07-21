package com.fullstack.app1.controller;

import com.fullstack.app1.entity.ChatRoom;
import com.fullstack.app1.entity.ChatMessage;
import com.fullstack.app1.repository.ChatRoomRepository;
import com.fullstack.app1.service.ChattingRoomService;
import com.fullstack.app1.service.ChattingMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatting")
@RequiredArgsConstructor
public class ChattingController {
    private final ChatRoomRepository chatRoomRepository;
    private final ChattingRoomService chattingRoomService;
    private final ChattingMessageService chattingMessageService;

    // 고객 ↔ 관리자 채팅방 생성 또는 조회
    @PostMapping("/room/customer")
    public ResponseEntity<ChatRoom> createCustomerRoom(@RequestParam Long userId) {
        return ResponseEntity.ok(chattingRoomService.createOrFindRoomWithAdmin(userId));
    }

    // 고객 전용: 내가 속한 채팅방들
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getMyRooms(@RequestParam Long userId) {
        return ResponseEntity.ok(chattingRoomService.getRoomsForUser(userId));
    }

    // 고객 전용: 채팅 메시지만 삭제
    @DeleteMapping("/messages/{roomId}/clear")
    public ResponseEntity<?> clearMessages(@PathVariable Long roomId) {
        try {
            chattingMessageService.deleteMessagesByRoomId(roomId);
            return ResponseEntity.ok("채팅 메시지가 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("채팅 메시지 삭제 실패: " + e.getMessage());
        }
    }

    // 관리자 전용: 전체 고객 채팅방 목록
    @GetMapping("/admin/rooms")
    public Page<ChatRoom> getAllCustomerRooms(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return chattingRoomService.getAllRoomsForAdmin(pageable);
    }

    // 채팅 메시지 조회
    @GetMapping("/messages/{roomId}")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(chattingMessageService.getMessages(roomId));
    }

    // 채팅 메시지 전송
    @PostMapping("/message")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestParam Long roomId,
            @RequestParam Long senderId,
            @RequestParam String content) {
        return ResponseEntity.ok(chattingMessageService.sendMessage(roomId, senderId, content));
    }

    @DeleteMapping("/admin/rooms/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {
        try {
            // 1. 메시지 먼저 삭제
            chattingMessageService.deleteMessagesByRoomId(roomId);

            // 2. 채팅방 삭제
            chatRoomRepository.deleteById(roomId);

            return ResponseEntity.ok("채팅방이 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("채팅방 삭제 실패: " + e.getMessage());
        }
    }

}
