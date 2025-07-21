package com.fullstack.app1.service;

import com.fullstack.app1.entity.Product;
import com.fullstack.app1.repository.OrderItemRepository;
import com.fullstack.app1.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Optional<Product> update(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setPrice(updatedProduct.getPrice());
            product.setDescription(updatedProduct.getDescription());
            product.setThumbnailimg(updatedProduct.getThumbnailimg());
            product.setDetailimg(updatedProduct.getDetailimg());
            product.setPercent(updatedProduct.getPercent());
            product.setCategory(updatedProduct.getCategory());
            return productRepository.save(product);
        });
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        boolean hasOrderItem = orderItemRepository.existsByProduct(product);
        if (hasOrderItem) {
            product.setActive(false);
            productRepository.save(product);
        } else {
            productRepository.delete(product);
        }
    }

    @Transactional
    public void updateReviewAudioPath(Long productId, String audioPath) {
        productRepository.findById(productId).ifPresent(product -> {
            product.setReviewAudioPath(audioPath);
            productRepository.save(product);
        });
    }

    private String storeFile(MultipartFile file) {
        String filename = UUID.randomUUID().toString().replace("-", "") + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir, filename);

        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }

        try {
            file.transferTo(dest);
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패: " + e.getMessage());
        }
    }

    public Product saveWithImages(Product product, MultipartFile thumbnail, MultipartFile detail) {
        if (thumbnail != null && !thumbnail.isEmpty()) {
            product.setThumbnailimg(storeFile(thumbnail));
        }
        if (detail != null && !detail.isEmpty()) {
            product.setDetailimg(storeFile(detail));
        }
        return productRepository.save(product);
    }

    public Product updateWithImages(Long id, Product updatedProduct, MultipartFile thumbnail, MultipartFile detail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setCategory(updatedProduct.getCategory());
        product.setDescription(updatedProduct.getDescription());
        product.setPercent(updatedProduct.getPercent());

        if (thumbnail != null && !thumbnail.isEmpty()) {
            product.setThumbnailimg(storeFile(thumbnail));
        }
        if (detail != null && !detail.isEmpty()) {
            product.setDetailimg(storeFile(detail));
        }

        return productRepository.save(product);
    }
}
