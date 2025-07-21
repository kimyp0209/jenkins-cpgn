package com.fullstack.app1.controller;

import com.fullstack.app1.entity.CartItem;
import com.fullstack.app1.repository.CartRepository;
import com.fullstack.app1.service.CartService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CartRepository cartRepository;

    @PostMapping
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem item, HttpSession session, Principal principal) {
        String sessionId = session.getId();
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;


        System.out.println("받은 percent = " + item.getPercent());
        return ResponseEntity.ok(cartService.addItem(sessionId, userId, item));
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(HttpSession session, Principal principal) {
        String sessionId = session.getId();
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;


        return ResponseEntity.ok(cartService.getItems(sessionId, userId));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<CartItem> updateQuantity(
            @PathVariable("productId") Long productId,
            @RequestBody CartItem item,
            HttpSession session,
            Principal principal
    ) {
        String sessionId = session.getId();
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;

        System.out.println("➡ userId = " + userId);
        return ResponseEntity.ok(cartService.updateQuantity(sessionId, userId, productId, item.getQuantity()));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> delete(
            @PathVariable("productId") Long productId,
            HttpSession session,
            Principal principal
    ) {
        String sessionId = session.getId();
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;


        System.out.println("🗑️ 삭제 요청 - productId: " + productId + ", sessionId: " + sessionId + ", userId: " + userId);
        cartService.removeItem(sessionId, userId, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(HttpSession session) {
        String sessionId = session.getId();
        Object userIdObj = session.getAttribute("userId");

        if (userIdObj != null) {
            // 회원 장바구니 비우기
            String userId = String.valueOf(userIdObj);
            cartRepository.findAllByUserId(userId).forEach(cartRepository::delete);
        } else {
            // 비회원 장바구니 비우기
            cartRepository.findAllBySessionId(sessionId).forEach(cartRepository::delete);
        }

        return ResponseEntity.ok().build();
    }

}
