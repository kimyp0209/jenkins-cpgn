package com.fullstack.app1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TossPaymentRequest {
    private int amount;
    private String orderId;
    private String orderName;
    private String customerName;
    private String successUrl;
    private String failUrl;
}
