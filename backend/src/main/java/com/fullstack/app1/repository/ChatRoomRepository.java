package com.fullstack.app1.repository;

import com.fullstack.app1.entity.ChatRoom;
import com.fullstack.app1.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByUser1OrUser2(User user1, User user2);
    Optional<ChatRoom> findByUser1AndUser2(User user1, User user2);
    Optional<ChatRoom> findByUser2AndUser1(User user2, User user1);

    @Query("SELECT r FROM ChatRoom r WHERE r.user1 = :admin OR r.user2 = :admin ORDER BY r.createdAt DESC")
    Page<ChatRoom> findAllByAdmin(@Param("admin") User admin, Pageable pageable);

    void deleteByUser1IdOrUser2Id(Long user1Id, Long user2Id);

}