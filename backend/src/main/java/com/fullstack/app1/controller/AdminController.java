package com.fullstack.app1.controller;

import com.fullstack.app1.dto.OrderResponse;
import com.fullstack.app1.entity.*;
import com.fullstack.app1.repository.*;
import com.fullstack.app1.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final QnaRepository qnaRepository;
    private final OrderService orderService;
    private final ReviewRepository reviewRepository;

    public record AdminReviewDto(
            Long id,
            String content,
            int rating,
            String username,
            String productName,
            String imagePath,
            LocalDateTime createdAt
    ) {}

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getAdminSummary() {
        Map<String, Object> summary = new HashMap<>();

        // 통계 수치
        summary.put("userCount", userRepository.count());
        summary.put("productCount", productRepository.count());
        summary.put("orderCount", orderRepository.count());
        summary.put("qnaUnansweredCount", qnaRepository.countByAnswerContentIsNull());

        // 최근 QnA 5개
        List<Map<String, Object>> recentQnas = qnaRepository.findTop5ByOrderByQuestionCreatedDesc()
                .stream()
                .map(qna -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", qna.getId());
                    map.put("title", qna.getQuestionTitle());
                    return map;
                })
                .collect(Collectors.toList());

        // 최근 주문 5개
        List<Map<String, Object>> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(order -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", order.getId());
                    map.put("totalAmount", order.getTotalAmount());
                    String username;
                    try {
                        User user = order.getUser();
                        username = (user != null) ? user.getUsername() : "비회원";
                    } catch (jakarta.persistence.EntityNotFoundException e) {
                        username = "삭제된 사용자";
                    }
                    map.put("username", username);
                    return map;
                })
                .collect(Collectors.toList());

        // ❗ 변수명 오타 수정
        summary.put("recentQnas", recentQnas);
        summary.put("recentOrders", recentOrders);

        return ResponseEntity.ok(summary);
    }


    // ✅ Q&A 전체 목록
    @GetMapping("/qnas")
    public Page<Qna> getAllQnas(@PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return qnaRepository.findAll(pageable);
    }

    // ✅ 사용자 전체 목록
    @GetMapping("/users")
    public Page<User> getUsers(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return userRepository.findAll(pageable);
    }

    // ✅ 주문 전체 목록
    @GetMapping("/orders")
    public Page<OrderResponse> getPagedOrders(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return orderRepository.findAll(pageable)
                .map(order -> {
                    String username;
                    try {
                        username = (order.getUser() != null) ? order.getUser().getUsername() : "비회원";
                    } catch (EntityNotFoundException e) {
                        username = "삭제된 사용자";
                    }

                    return new OrderResponse(
                            order.getId(),
                            username,
                            order.getTotalAmount(),
                            order.getStatus(),
                            order.getCreatedAt()
                    );
                });
    }


    // ✅ 상품 전체 목록
    @GetMapping("/products")
    public Page<Product> getPagedProducts(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return productRepository.findAll(pageable);
    }

    // ✅ 리뷰 전체 목록 (관리자용)
    @GetMapping("/reviews")
    public Page<AdminReviewDto> getAllReviews(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviewRepository.findAll(pageable)
                .map(review -> new AdminReviewDto(
                        review.getId(),
                        review.getContent(),
                        review.getRating(),
                        review.getUsername(),
                        review.getProduct() != null ? review.getProduct().getName() : "삭제된 상품",
                        review.getImagePath(),
                        review.getCreatedAt()
                ));
    }

    // ✅ 리뷰 삭제 (관리자용)
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<?> adminDeleteReview(@PathVariable Long reviewId) {
        reviewRepository.deleteById(reviewId);
        return ResponseEntity.ok("삭제 완료");
    }

    // ✅ 사용자 삭제 (관리자용)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserByAdmin(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("삭제 완료");
    }




}
