package com.fullstack.app1.repository;

import com.fullstack.app1.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findTop8ByOrderByCreatedAtDesc();
    List<Product> findTop8ByOrderByViewsDesc();
    List<Product> findByCategoryAndActiveTrueOrderByCreatedAtDesc(String category);
    List<Product> findAllByActiveTrueOrderByCreatedAtDesc();
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();
}
