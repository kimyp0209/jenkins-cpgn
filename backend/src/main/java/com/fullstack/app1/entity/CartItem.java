package com.fullstack.app1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private int price;
    private int quantity;
    private int percent;
    private String thumbnailimg;

    @Column(name = "session_id")
    private String sessionId; // 비회원

    @Column(name = "user_id")
    private String userId;

    private Long productId;
}
