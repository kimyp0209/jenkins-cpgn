package com.fullstack.app1.repository;

import com.fullstack.app1.entity.OrderItem;
import com.fullstack.app1.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // User의 id(Long)를 기준으로 조회하는 경우
    boolean existsByOrder_User_IdAndProduct_Id(Long userId, Long productId);

    // 또는 username(String)을 기준으로 조회하는 경우
    boolean existsByOrder_User_UsernameAndProduct_Id(String username, Long productId);
    boolean existsByProduct(Product product);
}
