package com.fullstack.app1.controller;

import com.fullstack.app1.entity.Product;
import com.fullstack.app1.repository.ProductRepository;
import com.fullstack.app1.service.BannerGenerationService;
import com.fullstack.app1.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/banner")
@RequiredArgsConstructor
public class BannerController {

    private final ProductRepository productRepository;
    private final BannerGenerationService bannerGenerationService;

    @PostMapping("/popular/generate")
    public ResponseEntity<?> generatePopularBanner() {
        List<Product> popular = productRepository.findTop8ByOrderByViewsDesc();

        String baseUrl = "http://localhost:8003"; // 또는 실제 서버 도메인
        List<String> imageUrls = popular.stream()
                .map(Product::getThumbnailimg)
                .filter(Objects::nonNull)
                .map(path -> baseUrl + path) // ✅ 절대경로로 바꿔줌
                .limit(5)
                .collect(Collectors.toList());

        Collections.shuffle(imageUrls); // 랜덤 느낌

        String prompt = """
Create a clean and stylish summer fashion banner for a women's clothing store named "Compagno".
Use the following product images arranged aesthetically with balanced spacing (no product names).
Design should include soft background color and scattered product photos (like boots, skirts, t-shirts, bags).
Overlay text on the banner:
- Top: "Weekly New Drop"
- Middle: "취향 저격 여름템 모음"
- Bottom: "~35% 혜택 | 일부 단독"
Image size: horizontal 1920x300 banner.
Reference image URLs:
""" + String.join("\n", imageUrls);

        String savedImagePath = bannerGenerationService.generateAndSaveImage(prompt);
        return ResponseEntity.ok().body(savedImagePath);
    }



}
