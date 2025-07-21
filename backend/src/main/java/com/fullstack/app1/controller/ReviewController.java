package com.fullstack.app1.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fullstack.app1.entity.Product;
import com.fullstack.app1.entity.Review;
import com.fullstack.app1.entity.User;
import com.fullstack.app1.repository.ProductRepository;
import com.fullstack.app1.repository.ReviewRepository;
import com.fullstack.app1.repository.UserRepository;
import com.fullstack.app1.service.OpenAiClient;
import com.fullstack.app1.service.ProductService;
import com.fullstack.app1.service.ReviewService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ProductService productService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final OpenAiClient openAiClient;

    public record ReviewDto(
            Long id,
            String content,
            int rating,
            String username,
            String imagePath,
            Long productId,
            Long orderId,
            String product,
            LocalDateTime createdAt
    ) {}

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable("productId") Long productId) {
        List<ReviewDto> dtoList = reviewService.getReviewsByProductId(productId).stream()
                .map(r -> new ReviewDto(
                        r.getId(), r.getContent(), r.getRating(), r.getUsername(),
                        r.getImagePath() != null ? r.getImagePath().toString() : null, r.getProduct().getId(), r.getOrderId(),
                        r.getProduct().getName(), r.getCreatedAt()
                )).toList();
        return ResponseEntity.ok(dtoList);
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(value = "/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReview(
            @PathVariable Long productId,
            @RequestPart("review") String reviewJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            Review review = objectMapper.readValue(reviewJson, Review.class);

            // productId로 상품 엔티티 설정
            Product product = productService.findById(productId).orElseThrow(() -> new RuntimeException("상품 없음"));
            review.setProduct(product);

            // 이미지 저장 및 경로 세팅
            if (image != null && !image.isEmpty()) {
                String imagePath = reviewService.storeFile(image);
                review.setImagePath(imagePath);
            }

            Review saved = reviewService.createReview(review);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("리뷰 등록 실패: " + e.getMessage());
        }
    }



    @PutMapping(value = "/update/{reviewId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @RequestPart("review") String reviewJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            Review reviewData = objectMapper.readValue(reviewJson, Review.class);

            String imagePath = reviewData.getImagePath(); // 기존 경로 유지
            if (image != null && !image.isEmpty()) {
                imagePath = reviewService.storeFile(image);
            }

            Review updated = reviewService.updateReview(
                    reviewId,
                    reviewData.getContent(),
                    reviewData.getRating(),
                    reviewData.getUserId(),
                    imagePath
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("리뷰 수정 실패: " + e.getMessage());
        }
    }




    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        reviewService.deleteReview(reviewId, loginUser.getId());
        return ResponseEntity.ok("삭제 완료");
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkReview(@RequestParam Long orderId, @RequestParam Long productId, @RequestParam Long userId) {
        return reviewService.findByOrderIdAndProductIdAndUserId(orderId, productId, userId)
                .map(ResponseEntity::ok).orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ReviewDto>> getMyReviews(
            HttpSession session,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        System.out.println("💬 현재 페이지 번호: " + pageable.getPageNumber());
        System.out.println("💬 페이지 크기: " + pageable.getPageSize());

        Object userIdObj = session.getAttribute("userId");
        if (userIdObj == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Long userId = (userIdObj instanceof Long) ? (Long) userIdObj : Long.parseLong(userIdObj.toString());

        Page<ReviewDto> dtoPage = reviewRepository.findByUserId(userId, pageable)
                .map(r -> new ReviewDto(
                        r.getId(), r.getContent(), r.getRating(), r.getUsername(),
                        r.getImagePath(), r.getProduct().getId(), r.getOrderId(),
                        r.getProduct().getName(), r.getCreatedAt()
                ));

        return ResponseEntity.ok(dtoPage);
    }


    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable Long reviewId) {
        Optional<Review> optionalReview = reviewRepository.findById(reviewId);

        if (optionalReview.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review review = optionalReview.get();

        ReviewDto dto = new ReviewDto(
                review.getId(),
                review.getContent(),
                review.getRating(),
                review.getUsername(),
                review.getImagePath(),
                review.getProduct().getId(),
                review.getOrderId(),
                review.getProduct().getName(),
                review.getCreatedAt()
        );

        return ResponseEntity.ok(dto);
    }


    @PostMapping("/audio-summary/{productId}")
    public ResponseEntity<?> generateAudioSummary(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findAllByProductId(productId);

        if (reviews.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("리뷰가 존재하지 않습니다.");
        }

        // ✅ 자연스러운 요약문 생성을 위한 프롬프트
        String reviewTexts = reviews.stream()
                .map(Review::getContent)
                .collect(Collectors.joining("\n- "));

        String prompt = """
        너는 쇼핑몰 운영자야. 아래는 어떤 상품에 대한 고객 리뷰들이야. 
        문장을 연결해서 하나의 자연스러운 후기 요약문으로 만들어 줘. 
        제품에 대한 긍정적인 포인트 위주로 1~2문장으로 정리해 줘. 
        이모지나 인사말은 빼줘.

        리뷰 목록:
        """ + reviewTexts;

        // ✅ GPT 요약 요청
        String summary = openAiClient.generateText(prompt);

        // ✅ TTS 변환
        String audioUrl = openAiClient.generateTTS(summary);

        // ✅ DB에 저장
        Product product = productRepository.findById(productId).orElseThrow();
        product.setReviewAudioPath(audioUrl);
        productRepository.save(product);

        return ResponseEntity.ok(Map.of("summary", summary, "audioUrl", audioUrl));
    }



    @GetMapping("/{productId}/audio-summary")
    public ResponseEntity<Map<String, String>> getAudioSummary(@PathVariable Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        String path = product.getReviewAudioPath();
        if (path == null || path.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.ok(Map.of("audioUrl", path));
    }

}
