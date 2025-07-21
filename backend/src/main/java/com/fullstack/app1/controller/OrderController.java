package com.fullstack.app1.controller;

import com.fullstack.app1.dto.OrderDetailResponse;
import com.fullstack.app1.entity.CartItem;
import com.fullstack.app1.entity.Order;
import com.fullstack.app1.entity.TossConfirmRequest;
import com.fullstack.app1.repository.OrderRepository;
import com.fullstack.app1.service.OrderService;
import com.fullstack.app1.service.TossPaymentClient;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final TossPaymentClient tossPaymentClient;
    private final OrderService orderService;
    private final OrderRepository orderRepository;

    // 1️⃣ 결제 준비
    @PostMapping("/prepare")
    public ResponseEntity<?> prepareOrder(@RequestBody Map<String, Object> payload, HttpSession session) {
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");

        if (items == null || items.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "선택된 상품이 없습니다."));
        }

        String name = (String) payload.get("name");
        String phone = (String) payload.get("phone");
        String address = (String) payload.get("address");

        session.setAttribute("shippingName", name);
        session.setAttribute("shippingPhone", phone);
        session.setAttribute("shippingAddress", address);
        session.setAttribute("selectedItems", items);

        int totalAmount = items.stream()
                .mapToInt(item -> {
                    double price = ((Number) item.get("price")).doubleValue();
                    int quantity = (int) item.get("quantity");
                    int percent = (int) item.get("percent");
                    return (int) (price * (1 - percent / 100.0) * quantity);
                })
                .sum();

        String orderId = UUID.randomUUID().toString();

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("amount", totalAmount);
        response.put("orderName", "선택 상품 결제");
        response.put("customerName", name != null ? name : "비회원");

        return ResponseEntity.ok(response);
    }

    // 2️⃣ 결제 확인
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOrder(@RequestBody TossConfirmRequest request, HttpSession session) {
        try {
            ResponseEntity<String> tossResponse = tossPaymentClient.confirmPayment(
                    request.getPaymentKey(), request.getOrderId(), request.getAmount());

            if (!tossResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(tossResponse.getStatusCode())
                        .body("Toss 결제 확인 실패: " + tossResponse.getBody());
            }

            String name = (String) session.getAttribute("shippingName");
            String phone = (String) session.getAttribute("shippingPhone");
            String address = (String) session.getAttribute("shippingAddress");

            if (name == null || phone == null || address == null) {
                return ResponseEntity.badRequest().body("배송 정보가 유효하지 않습니다.");
            }

            String sessionId = session.getId();
            String userId = session.getAttribute("userId") != null
                    ? session.getAttribute("userId").toString()
                    : null;

            Object rawItems = session.getAttribute("selectedItems");
            if (!(rawItems instanceof List<?> selectedList)) {
                return ResponseEntity.badRequest().body("선택된 상품 정보가 유효하지 않습니다.");
            }

            List<CartItem> cartItems = new ArrayList<>();
            for (Object obj : selectedList) {
                if (obj instanceof Map<?, ?> item) {
                    CartItem cartItem = new CartItem();
                    cartItem.setProductId(Long.valueOf(item.get("productId").toString()));
                    cartItem.setProductName((String) item.get("productName"));
                    cartItem.setPrice(((Number) item.get("price")).intValue());
                    cartItem.setQuantity(((Number) item.get("quantity")).intValue());
                    cartItem.setPercent(((Number) item.get("percent")).intValue());
                    cartItem.setThumbnailimg((String) item.get("thumbnailimg"));
                    cartItems.add(cartItem);
                }
            }

            Order savedOrder = orderService.saveOrder(
                    request,
                    cartItems,
                    sessionId,
                    userId,
                    name,
                    phone,
                    address,
                    request.getOrderId()
            );

            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("결제 처리 중 오류 발생: " + e.getMessage());
        }
    }

    // 3️⃣ 주문 상세 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable("orderId") String orderId) {
        return orderRepository.findWithItemsByOrderId(orderId)
                .map(order -> {
                    OrderDetailResponse dto = orderService.toOrderDetailResponse(order);
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 4️⃣ 주문 목록 조회
    @GetMapping("/list")
    public ResponseEntity<?> getOrderList(HttpSession session) {
        String sessionId = session.getId();
        String userId = session.getAttribute("userId") != null
                ? session.getAttribute("userId").toString()
                : null;

        List<Order> orders = (userId != null)
                ? orderRepository.findWithItemsByUserId(Long.valueOf(userId))
                : orderRepository.findWithItemsBySessionId(sessionId);

        return ResponseEntity.ok(orders);
    }

    // 5️⃣ 관리자: ID로 주문 조회
    @GetMapping("/admin/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Long id) {
        return orderRepository.findWithItemsById(id)
                .map(order -> orderService.toOrderDetailResponse(order))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
