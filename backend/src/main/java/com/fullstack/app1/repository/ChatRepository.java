package com.fullstack.app1.repository;

import com.fullstack.app1.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    // 채팅을 시간순으로 조회 (최근 순)
    List<Chat> findAllByOrderByCreatedAtAsc();
}
