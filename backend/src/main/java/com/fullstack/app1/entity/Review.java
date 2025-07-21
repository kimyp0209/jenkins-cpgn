package com.fullstack.app1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product; // ✅ 연관관계로만 설정

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = true)
    private String imagePath;

    @Column(nullable = false)
    private int rating;

    @Column
    private String username;

    private LocalDateTime createdAt;

    private Long orderId;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}

