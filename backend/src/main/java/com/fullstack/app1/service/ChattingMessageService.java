package com.fullstack.app1.service;

import com.fullstack.app1.entity.ChatMessage;
import com.fullstack.app1.entity.ChatRoom;
import com.fullstack.app1.entity.User;
import com.fullstack.app1.repository.ChatMessageRepository;
import com.fullstack.app1.repository.ChatRoomRepository;
import com.fullstack.app1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChattingMessageService {

    private final ChatMessageRepository chatMsgRepo;
    private final ChatRoomRepository chatRoomRepo;
    private final UserRepository userRepo;

    public List<ChatMessage> getMessages(Long roomId) {
        return chatMsgRepo.findByRoomIdOrderByTimestampAsc(roomId);
    }

    public ChatMessage sendMessage(Long roomId, Long senderId, String content) {
        ChatRoom room = chatRoomRepo.findById(roomId).orElseThrow();
        User sender = userRepo.findById(senderId).orElseThrow();

        ChatMessage message = new ChatMessage();
        message.setRoom(room);
        message.setSender(sender);
        message.setContent(content);
        return chatMsgRepo.save(message);
    }

    @Transactional
    public void deleteMessagesByRoomId(Long roomId) {
        chatMsgRepo.deleteMessagesByRoomId(roomId); // JPQL 직접 삭제
    }


}
