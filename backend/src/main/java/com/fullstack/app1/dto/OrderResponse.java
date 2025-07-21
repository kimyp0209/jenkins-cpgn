package com.fullstack.app1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String username;
    private int totalAmount;
    private String status;
    private LocalDateTime createdAt;
}
