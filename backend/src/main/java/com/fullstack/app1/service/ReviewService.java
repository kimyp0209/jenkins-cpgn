package com.fullstack.app1.service;

import com.fullstack.app1.entity.Order;
import com.fullstack.app1.entity.OrderItem;
import com.fullstack.app1.entity.Review;
import com.fullstack.app1.repository.OrderRepository;
import com.fullstack.app1.repository.ReviewRepository;
import com.fullstack.app1.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProduct_Id(productId);
    }

    public boolean hasPurchased(Long userId, Long productId) {
        List<Order> orders = orderRepository.findWithItemsByUserId(userId);
        return orders.stream()
                .flatMap(order -> order.getItems().stream())
                .anyMatch(item -> item.getProduct() != null && item.getProduct().getId().equals(productId));
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("빈 파일은 저장할 수 없습니다.");
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir, filename);

        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }

        try {
            file.transferTo(dest);
            return "/uploads/" + filename;
        } catch (IOException e) {
            e.printStackTrace(); // 🔍 로그 출력
            throw new RuntimeException("파일 저장 실패: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Review createReview(Review review) {
        Long userId = review.getUserId();
        Long productId = review.getProduct().getId();
        Long orderId = review.getOrderId();

        if (reviewRepository.existsByUserIdAndProductIdAndOrderId(userId, productId, orderId)) {
            throw new RuntimeException("이미 이 상품에 대한 리뷰를 작성했습니다.");
        }

        if (!hasPurchased(userId, productId)) {
            throw new RuntimeException("이 상품을 구매한 사용자만 리뷰를 작성할 수 있습니다.");
        }

        if (review.getUsername() == null || review.getUsername().isEmpty()) {
            String username = userRepository.findById(userId)
                    .map(user -> user.getUsername())
                    .orElse("Unknown");
            review.setUsername(username);
        }

        return reviewRepository.save(review);
    }


    @Transactional
    public Review updateReview(Long reviewId, String content, int rating, Long userId, String imagePath) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("리뷰 작성자만 수정할 수 있습니다.");
        }

        review.setContent(content);
        review.setRating(rating);

        // ✅ 이미지 경로가 비어있지 않으면 업데이트
        if (imagePath != null && !imagePath.isEmpty()) {
            review.setImagePath(imagePath);
        }

        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("리뷰 작성자만 삭제할 수 있습니다.");
        }

        reviewRepository.delete(review);
    }

    public Optional<Review> findByOrderIdAndProductIdAndUserId(Long orderId, Long productId, Long userId) {
        return reviewRepository.findByOrderIdAndProductIdAndUserId(orderId, productId, userId);
    }
}
