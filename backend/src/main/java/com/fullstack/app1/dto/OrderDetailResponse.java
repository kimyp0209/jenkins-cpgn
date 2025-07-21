package com.fullstack.app1.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDetailResponse {
    private Long id;
    private String orderId;
    private String name;
    private String phone;
    private String address;
    private int totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;

    @Data
    public static class OrderItemDto {
        private Long id;
        private String productName;
        private int price;
        private int quantity;
        private Long productId;
        private String thumbnailimg;
    }
}
