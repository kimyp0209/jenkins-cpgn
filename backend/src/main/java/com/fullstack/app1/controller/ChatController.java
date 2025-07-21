package com.fullstack.app1.controller;

import com.fullstack.app1.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/api/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        String reply = chatService.replyTo(message); // ✅ GPT 텍스트 응답만
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}
