package com.fullstack.app1.controller;

import com.fullstack.app1.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import com.fullstack.app1.entity.User;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


import java.util.Map;

@RestController
@RequiredArgsConstructor
public class KakaoController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final UserService userService;

    @PostMapping("/api/oauth/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> body, HttpSession session) {
        String code = body.get("code");

        // 1. Access Token 요청
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "");
        params.add("redirect_uri", "http://localhost:3000/oauth/kakao/callback");
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity("https://kauth.kakao.com/oauth/token", tokenRequest, Map.class);
        String accessToken = (String) tokenResponse.getBody().get("access_token");

        // 2. 사용자 정보 요청
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> userInfoRequest = new HttpEntity<>(userInfoHeaders);
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange("https://kapi.kakao.com/v2/user/me", HttpMethod.GET, userInfoRequest, Map.class);

        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfoResponse.getBody().get("kakao_account");
        String email = (String) kakaoAccount.get("email");
        String nickname = (String) ((Map<String, Object>) kakaoAccount.get("profile")).get("nickname");

        // 3. DB 등록 or 조회
        User user = userService.findOrCreateUserByEmail(email, nickname);

        // 4. 세션 저장
        session.setAttribute("loginUser", user);
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());

        return ResponseEntity.ok("카카오 로그인 성공");
    }

}
