package com.fullstack.app1.service;

import com.fullstack.app1.dto.OrderDetailResponse;
import com.fullstack.app1.dto.OrderResponse;
import com.fullstack.app1.entity.*;
import com.fullstack.app1.repository.CartRepository;
import com.fullstack.app1.repository.OrderRepository;
import com.fullstack.app1.repository.ProductRepository;
import com.fullstack.app1.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order saveOrder(TossConfirmRequest request,
                           List<CartItem> cartItems,
                           String sessionId,
                           String userId,
                           String name,
                           String phone,
                           String address,
                           String orderId) {

        System.out.println("✅ saveOrder 호출됨");

        int total = 0;

        User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId))
                    .orElseThrow(() -> new RuntimeException("❌ 사용자 없음: " + userId));
        }

        Order order = Order.builder()
                .sessionId(sessionId)
                .user(user)
                .username(user != null ? user.getUsername() : null)
                .orderId(orderId)
                .paymentKey(request.getPaymentKey())
                .payMethod(request.getMethod())
                .createdAt(LocalDateTime.now())
                .totalAmount(0) // 나중에 계산
                .status("PAID")
                .name(name)
                .phone(phone)
                .address(address)
                .build();

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem item : cartItems) {
            int discounted = (int) (item.getPrice() * (1 - item.getPercent() / 100.0));
            total += discounted * item.getQuantity();

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("❌ 상품 없음: " + item.getProductId()));

            orderItems.add(OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(item.getProductName())
                    .price(discounted)
                    .quantity(item.getQuantity())
                    .build());
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // 장바구니에서 삭제
        for (CartItem item : cartItems) {
            if (userId != null) {
                cartRepository.deleteByUserIdAndProductId(userId, item.getProductId());
            } else {
                cartRepository.deleteBySessionIdAndProductId(sessionId, item.getProductId());
            }
        }

        return savedOrder;
    }


    public List<Order> getOrders(String sessionId, String userId) {
        return (userId != null)
                ? userRepository.findById(Long.parseLong(userId))
                .map(orderRepository::findByUser)
                .orElse(List.of())
                : orderRepository.findBySessionId(sessionId);

    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAllWithUserOrderByCreatedAtDesc();

        return orders.stream().map(order -> new OrderResponse(
                order.getId(),
                order.getUser() != null ? order.getUser().getUsername() : "탈퇴회원",
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt()
        )).collect(Collectors.toList());
    }

    public OrderDetailResponse toOrderDetailResponse(Order order) {
        List<OrderDetailResponse.OrderItemDto> itemDtos = order.getItems().stream().map(this::toItemDto).collect(Collectors.toList());

        OrderDetailResponse dto = new OrderDetailResponse();
        dto.setId(order.getId());
        dto.setOrderId(order.getOrderId());
        dto.setName(order.getName());
        dto.setPhone(order.getPhone());
        dto.setAddress(order.getAddress());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(itemDtos);

        return dto;
    }

    private OrderDetailResponse.OrderItemDto toItemDto(OrderItem item) {
        OrderDetailResponse.OrderItemDto dto = new OrderDetailResponse.OrderItemDto();
        dto.setId(item.getId());
        dto.setProductName(item.getProductName());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setProductId(item.getProductId());
        dto.setThumbnailimg(item.getProduct() != null ? item.getProduct().getThumbnailimg() : null);
        return dto;
    }

    public Page<OrderResponse> getPagedOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(order -> new OrderResponse(
                        order.getId(),
                        order.getUser() != null ? order.getUser().getUsername() : "비회원",
                        order.getTotalAmount(),
                        order.getStatus(),
                        order.getCreatedAt()
                ));
    }


}

