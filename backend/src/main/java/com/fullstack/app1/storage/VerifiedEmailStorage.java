package com.fullstack.app1.storage;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class VerifiedEmailStorage {

    private final Map<String, Boolean> verifiedEmails = new ConcurrentHashMap<>();

    // 인증 성공 처리
    public void markVerified(String email) {
        verifiedEmails.put(email, true);
    }

    // 인증 여부 확인
    public boolean isVerified(String email) {
        return verifiedEmails.getOrDefault(email, false);
    }

    // 인증 정보 제거 (회원가입 완료 후)
    public void remove(String email) {
        verifiedEmails.remove(email);
    }
}
