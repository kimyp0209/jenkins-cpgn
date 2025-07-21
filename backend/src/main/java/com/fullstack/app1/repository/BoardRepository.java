package com.fullstack.app1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fullstack.app1.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {
}
