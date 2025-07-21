package com.fullstack.app1.service;

import com.fullstack.app1.entity.CartItem;
import com.fullstack.app1.repository.CartRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    public CartItem addItem(String sessionId, String userId, CartItem item) {
        if (userId != null) {
            // 👉 회원일 경우: userId로 조회
            CartItem existing = cartRepository.findByUserIdAndProductId(userId, item.getProductId()).orElse(null);
            if (existing != null) {
                existing.setQuantity(existing.getQuantity() + item.getQuantity());
                return cartRepository.save(existing);
            }

            // 새 항목이면 userId 설정
            item.setUserId(userId);


        } else {
            // 👉 비회원일 경우: sessionId로 조회
            CartItem existing = cartRepository.findBySessionIdAndProductId(sessionId, item.getProductId()).orElse(null);
            if (existing != null) {
                existing.setQuantity(existing.getQuantity() + item.getQuantity());
                return cartRepository.save(existing);
            }

            // 새 항목이면 sessionId 설정
            item.setSessionId(sessionId);
        }

        // 공통 항목 설정
        CartItem newItem = new CartItem();
        newItem.setProductId(item.getProductId());
        newItem.setProductName(item.getProductName());
        newItem.setPrice(item.getPrice());
        newItem.setPercent(item.getPercent());
        newItem.setQuantity(item.getQuantity());
        newItem.setThumbnailimg(item.getThumbnailimg());
        newItem.setUserId(item.getUserId());
        newItem.setSessionId(item.getSessionId());

        return cartRepository.save(newItem);
    }



    public List<CartItem> getItems(String sessionId, String userId) {
        return (userId != null)
                ? cartRepository.findAllByUserId(userId)
                : cartRepository.findAllBySessionId(sessionId);
    }

    public CartItem updateQuantity(String sessionId, String userId, Long productId, int quantity) {
        CartItem item = (userId != null)
                ? cartRepository.findByUserIdAndProductId(userId, productId).orElseThrow()
                : cartRepository.findBySessionIdAndProductId(sessionId, productId).orElseThrow();

        item.setQuantity(quantity);
        return cartRepository.save(item);
    }

    @Transactional
    public void removeItem(String sessionId, String userId, Long productId) {
        if (userId != null) {
            cartRepository.deleteByUserIdAndProductId(userId, productId);
        } else {
            cartRepository.deleteBySessionIdAndProductId(sessionId, productId);
        }
    }

}

