package com.fullstack.app1.repository;

import com.fullstack.app1.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    // ✅ 비회원용
    Optional<CartItem> findBySessionIdAndProductId(String sessionId, Long productId);
    List<CartItem> findAllBySessionId(String sessionId);
    void deleteBySessionIdAndProductId(String sessionId, Long productId);
    void deleteAllBySessionId(String sessionId);


    // ✅ 회원용
    Optional<CartItem> findByUserIdAndProductId(String userId, Long productId);
    List<CartItem> findAllByUserId(String userId);
    void deleteByUserIdAndProductId(String userId, Long productId);
    void deleteAllByUserId(String userId);

}

