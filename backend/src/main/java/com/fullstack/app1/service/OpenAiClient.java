package com.fullstack.app1.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;


@Service
@RequiredArgsConstructor
public class OpenAiClient {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)   // 연결 타임아웃
            .readTimeout(60, TimeUnit.SECONDS)      // 읽기 타임아웃
            .writeTimeout(60, TimeUnit.SECONDS)     // 쓰기 타임아웃
            .build();

    public String generateTTS(String text) {
        try {
            Map<String, Object> jsonMap = new HashMap<>();
            jsonMap.put("model", "tts-1");
            jsonMap.put("input", text);
            jsonMap.put("voice", "shimmer");

            Gson gson = new Gson();
            String json = gson.toJson(jsonMap);

            RequestBody body = RequestBody.create(
                    json, MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/audio/speech")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No body";
                System.out.println("🔥 TTS API 오류 응답: " + errorBody);
                throw new RuntimeException("TTS 실패: " + response.code() + " - " + errorBody);
            }

            byte[] audioBytes = response.body().bytes();
            String fileName = UUID.randomUUID() + ".mp3";
            String fullPath = uploadDir + File.separator + fileName;

            // ✅ 디렉토리 생성
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    throw new IOException("업로드 디렉토리 생성 실패: " + uploadDir);
                }
            }

            try (FileOutputStream fos = new FileOutputStream(fullPath)) {
                fos.write(audioBytes);
            }

            return "/uploads/" + fileName;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("TTS 처리 중 오류 발생: " + e.getMessage());
        }
    }



    public String generateText(String prompt) {
        try {
            MediaType mediaType = MediaType.parse("application/json");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");

            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            requestBody.put("messages", List.of(message));

            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(requestBody);

            RequestBody body = RequestBody.create(json, mediaType);

            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/chat/completions")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();
            if (!response.isSuccessful()) {
                throw new RuntimeException("텍스트 생성 실패: " + response);
            }

            String responseBody = response.body().string();

            // ✅ JSON 파싱으로 안전하게 content 꺼냄
            JsonNode root = objectMapper.readTree(responseBody);
            String result = root.path("choices").get(0).path("message").path("content").asText();

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("텍스트 생성 중 오류 발생");
        }
    }
    public String generateImage(String prompt) {
        try {
            MediaType mediaType = MediaType.parse("application/json");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "dall-e-3");
            requestBody.put("prompt", prompt);
            requestBody.put("n", 1);
            requestBody.put("size", "1024x1024");
            requestBody.put("response_format", "url");

            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(requestBody);

            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/images/generations")
                    .post(RequestBody.create(json, mediaType))
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "no body";
                throw new RuntimeException("이미지 생성 실패: " + response.code() + " - " + errorBody);
            }

            String responseBody = response.body().string();
            JsonNode root = objectMapper.readTree(responseBody);
            return root.path("data").get(0).path("url").asText(); // ✅ 이미지 URL 반환

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("이미지 생성 중 오류 발생: " + e.getMessage());
        }
    }


}
