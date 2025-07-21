package com.fullstack.app1.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Qna {

    /* ---------- 기본 키 ---------- */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ---------- 질문 영역 ---------- */
    private String questionTitle;          // 질문 제목

    @Column(columnDefinition = "TEXT")
    private String questionContent;        // 질문 내용

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User questionUser;  // 질문 작성자 (로그인한 사용자)

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime questionCreated; // 질문 작성 시각

    /* ---------- 답변 영역 (관리자 전용) ---------- */
    @Column(columnDefinition = "TEXT")
    private String answerContent;          // 답변 내용 (미답변이면 null)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_admin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User answerAdmin;   // 답변 관리자

    private LocalDateTime answerCreated;   // 답변 작성 시각 (미답변이면 null)

    /* ---------- 자동 시간 세팅 ---------- */
    @PrePersist
    public void onCreate() {
        this.questionCreated = LocalDateTime.now();
    }
}
