package com.fullstack.app1.controller;

import com.fullstack.app1.storage.VerifiedEmailStorage;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {

    private final JavaMailSender mailSender;
    private final VerifiedEmailStorage verifiedEmailStorage;

    private final Map<String, String> codeStorage = new HashMap<>();

    @PostMapping("/send")
    public ResponseEntity<?> sendMail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);

        codeStorage.put(email, code);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setTo(email);
            helper.setFrom("mina7p3829@gmail.com"); // 명시적으로 설정
            helper.setSubject("회원가입 인증 코드");
            helper.setText("인증 코드: " + code, false);

            mailSender.send(mimeMessage);
            return ResponseEntity.ok("이메일 전송 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("이메일 전송 실패: " + e.getMessage());
        }
    }


    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String inputCode = body.get("code");
        String correctCode = codeStorage.get(email);

        if (correctCode != null && correctCode.equals(inputCode)) {
            verifiedEmailStorage.markVerified(email);  // ✅ 여기서 인증 상태 저장
            return ResponseEntity.ok("인증 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }
}
