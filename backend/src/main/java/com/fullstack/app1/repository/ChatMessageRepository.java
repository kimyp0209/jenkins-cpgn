package com.fullstack.app1.repository;

import com.fullstack.app1.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoomIdOrderByTimestampAsc(Long roomId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ChatMessage m WHERE m.room.id = :roomId")
    void deleteMessagesByRoomId(@Param("roomId") Long roomId);
}