package com.fullstack.app1.repository;

import com.fullstack.app1.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_Id(Long productId);
    @Query("""
    SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END
    FROM Review r
    WHERE r.userId = :userId AND r.product.id = :productId AND r.orderId = :orderId
""")
    boolean existsByUserIdAndProductIdAndOrderId(@Param("userId") Long userId,
                                                 @Param("productId") Long productId,
                                                 @Param("orderId") Long orderId);

    Optional<Review> findByOrderIdAndProductIdAndUserId(Long orderId, Long productId, Long userId);

    List<Review> findAllByProductId(Long productId);
    Page<Review> findByUserId(Long userId, Pageable pageable);
}

