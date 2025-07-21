package com.fullstack.app1.controller;

import com.fullstack.app1.entity.User;
import com.fullstack.app1.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
public class GoogleOAuthController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final UserService userService;

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body, HttpSession session) {
        try {
            String code = body.get("code");
            String redirectUri = body.get("redirectUri");

            // 1. Access Token 요청
            String tokenUrl = "https://oauth2.googleapis.com/token";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code");

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, tokenRequest, Map.class);

            if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(400).body("구글 토큰 발급 실패");
            }

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // 2. 사용자 정보 요청
            HttpHeaders userInfoHeaders = new HttpHeaders();
            userInfoHeaders.set("Authorization", "Bearer " + accessToken);
            HttpEntity<String> userInfoRequest = new HttpEntity<>(userInfoHeaders);

            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    userInfoRequest,
                    Map.class
            );

            if (!userInfoResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(400).body("구글 사용자 정보 조회 실패");
            }

            Map userInfo = userInfoResponse.getBody();
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");

            // 3. 유저 등록 or 조회
            User user = userService.findOrCreateUserByEmail(email, name);

            // 4. 세션 저장
            session.setAttribute("loginUser", user);
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());

            return ResponseEntity.ok("Google 로그인 성공");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Google 로그인 처리 중 오류 발생");
        }
    }
}
