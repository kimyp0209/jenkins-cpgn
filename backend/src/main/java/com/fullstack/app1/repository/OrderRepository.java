package com.fullstack.app1.repository;

import com.fullstack.app1.entity.Order;
import com.fullstack.app1.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

    List<Order> findBySessionId(String sessionId);

    List<Order> findTop5ByOrderByCreatedAtDesc();

    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.items i " +
            "LEFT JOIN FETCH i.product " +
            "WHERE o.orderId = :orderId")
    Optional<Order> findWithItemsByOrderId(@Param("orderId") String orderId);

    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.items i " +
            "LEFT JOIN FETCH i.product " +
            "WHERE o.user.id = :userId " +
            "ORDER BY o.createdAt DESC")
    List<Order> findWithItemsByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.items i " +
            "LEFT JOIN FETCH i.product " +
            "WHERE o.sessionId = :sessionId " +
            "ORDER BY o.createdAt DESC")
    List<Order> findWithItemsBySessionId(@Param("sessionId") String sessionId);

    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.user " +
            "ORDER BY o.createdAt DESC")
    List<Order> findAllWithUserOrderByCreatedAtDesc();

    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findWithItemsById(@Param("id") Long id);



}
