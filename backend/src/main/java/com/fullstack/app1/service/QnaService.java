package com.fullstack.app1.service;

import com.fullstack.app1.entity.Qna;
import com.fullstack.app1.entity.User;
import com.fullstack.app1.repository.QnaRepository;
import com.fullstack.app1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QnaService {

    private final QnaRepository qnaRepository;
    private final UserRepository userRepository;

    // 질문 등록 (로그인 사용자)
    public Qna createQuestion(Qna qna, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        qna.setQuestionUser(user);
        qna.setQuestionCreated(LocalDateTime.now());

        return qnaRepository.save(qna);
    }

    // 전체 목록 조회
    public List<Qna> findAll() {
        return qnaRepository.findAll();
    }

    // 단일 QnA 조회
    public Optional<Qna> findById(Long id) {
        return qnaRepository.findById(id);
    }

    // QnA 삭제 (작성자 또는 관리자만 가능)
    public void deleteById(Long id, Long userId) {
        Qna qna = qnaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 QnA를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        boolean isWriter = qna.getQuestionUser().getId().equals(user.getId());
        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isWriter && !isAdmin) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        qnaRepository.deleteById(id);
    }

    // 답변 등록/수정 (관리자만 가능)
    public Qna addAnswer(Long qnaId, String answerContent, Long adminId) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new RuntimeException("해당 QnA를 찾을 수 없습니다."));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!"ADMIN".equals(admin.getRole())) {
            throw new RuntimeException("답변 등록 권한이 없습니다.");
        }

        qna.setAnswerContent(answerContent);
        qna.setAnswerAdmin(admin);
        qna.setAnswerCreated(LocalDateTime.now());

        return qnaRepository.save(qna);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public void removeAnswer(Long qnaId) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new RuntimeException("QnA를 찾을 수 없습니다."));
        qna.setAnswerContent(null);
        qna.setAnswerCreated(null);
        qna.setAnswerAdmin(null);
        qnaRepository.save(qna);
    }

    public List<Qna> findByUserId(Long userId) {
        return qnaRepository.findByQuestionUser_Id(userId);
    }

    public Page<Qna> findByUserIdPaged(Long userId, Pageable pageable) {
        return qnaRepository.findByQuestionUser_Id(userId, pageable);
    }
}
