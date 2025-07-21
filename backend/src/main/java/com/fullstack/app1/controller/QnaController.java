package com.fullstack.app1.controller;

import com.fullstack.app1.entity.Qna;
import com.fullstack.app1.entity.User;
import com.fullstack.app1.service.QnaService;
import com.fullstack.app1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class QnaController {

    private final QnaService qnaService;
    private final UserService userService;

    // 질문 등록
    @PostMapping("/question")
    public ResponseEntity<?> submitQuestion(@RequestBody Qna qna, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Qna saved = qnaService.createQuestion(qna, userId);
        return ResponseEntity.ok(saved);
    }

    // QnA 전체 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<Qna>> getAllQna() {
        return ResponseEntity.ok(qnaService.findAll());
    }

    // QnA 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getQnaDetail(@PathVariable("id") Long id) {
        return qnaService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("QnA를 찾을 수 없습니다."));
    }


    // QnA 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteQna(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            qnaService.deleteById(id, userId);
            return ResponseEntity.ok("삭제 완료");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 답변 등록/수정
    @PostMapping("/answer/{id}")
    public ResponseEntity<?> submitAnswer(@PathVariable Long id,
                                          @RequestBody String answer,
                                          HttpSession session) {
        Long adminId = (Long) session.getAttribute("userId");
        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            Qna updated = qnaService.addAnswer(id, answer, adminId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 답변 수정 (관리자만)
    @PutMapping("/answer/{id}")
    public ResponseEntity<?> updateAnswer(@PathVariable Long id,
                                          @RequestBody String answerContent,
                                          HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 관리자 권한 확인
        User user = userService.getUserById(userId);
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 수정할 수 있습니다.");
        }

        // 여기서 id는 QnA ID, userId는 관리자 ID
        return ResponseEntity.ok(qnaService.addAnswer(id, answerContent, userId));
    }

    // 답변 삭제 (답변만 삭제, 질문 유지)
    @DeleteMapping("/answer/{id}")
    public ResponseEntity<?> deleteAnswer(
            @PathVariable Long id,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        User user = userService.getUserById(userId);
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 가능");
        }

        qnaService.removeAnswer(id);
        return ResponseEntity.ok("답변이 삭제되었습니다");
    }

    @GetMapping("/my")
    public ResponseEntity<Page<Qna>> getMyQna(
            HttpSession session,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long userId = (userIdObj instanceof Long) ? (Long) userIdObj : Long.parseLong(userIdObj.toString());
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "questionCreated"));
        Page<Qna> qnaPage = qnaService.findByUserIdPaged(userId, pageable);
        return ResponseEntity.ok(qnaPage);
    }


}
