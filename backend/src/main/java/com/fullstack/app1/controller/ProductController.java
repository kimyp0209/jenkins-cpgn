package com.fullstack.app1.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fullstack.app1.entity.Product;
import com.fullstack.app1.repository.ProductRepository;
import com.fullstack.app1.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "thumbnailFile", required = false) MultipartFile thumbnail,
            @RequestPart(value = "detailFile", required = false) MultipartFile detail
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Product product = objectMapper.readValue(productJson, Product.class);
            Product saved = productService.saveWithImages(product, thumbnail, detail);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "thumbnailFile", required = false) MultipartFile thumbnail,
            @RequestPart(value = "detailFile", required = false) MultipartFile detail
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Product product = objectMapper.readValue(productJson, Product.class);
            Product updated = productService.updateWithImages(id, product, thumbnail, detail);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Product>> list(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(productRepository.findByCategoryAndActiveTrueOrderByCreatedAtDesc(category));
        } else {
            return ResponseEntity.ok(productRepository.findAllByActiveTrueOrderByCreatedAtDesc());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> detail(@PathVariable("id") Long id) {
        Optional<Product> optionalProduct = productService.findById(id);

        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setViews(product.getViews() + 1);
            productService.save(product);
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/latest")
    public ResponseEntity<List<Product>> latestProducts() {
        List<Product> latest = productRepository.findTop8ByOrderByCreatedAtDesc();
        return ResponseEntity.ok(latest);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productRepository.findDistinctCategories());
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Product>> getPopularProducts() {
        List<Product> popular = productRepository.findTop8ByOrderByViewsDesc();
        return ResponseEntity.ok(popular);
    }
}
