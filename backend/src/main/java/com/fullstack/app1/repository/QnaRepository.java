package com.fullstack.app1.repository;

import com.fullstack.app1.entity.Qna;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QnaRepository extends JpaRepository<Qna, Long> {
    List<Qna> findByQuestionUser_Id(Long userId);

    // 미답변 QnA 수 (answerContent가 null인 것 카운트)
    long countByAnswerContentIsNull();

    // 최근 QnA 5개
    List<Qna> findTop5ByOrderByQuestionCreatedDesc();

    Page<Qna> findByQuestionUser_Id(Long userId, Pageable pageable);

    List<Qna> findAllByOrderByQuestionCreatedDesc();
}
