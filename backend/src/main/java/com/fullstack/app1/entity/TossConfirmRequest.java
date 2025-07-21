package com.fullstack.app1.entity;

import lombok.Data;

@Data
public class TossConfirmRequest {
    private String paymentKey;
    private String orderId;
    private int amount;
    private String method;
}