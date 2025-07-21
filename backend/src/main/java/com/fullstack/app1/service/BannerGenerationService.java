package com.fullstack.app1.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BannerGenerationService {

    private final OpenAiClient openAiClient;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String generateAndSaveImage(String prompt) {
        try {
            // 1. OpenAI로부터 이미지 URL 생성
            String imageUrl = openAiClient.generateImage(prompt);

            // 2. 업로드 디렉토리 없으면 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 3. 이미지 다운로드
            URL url = new URL(imageUrl);
            InputStream in = url.openStream();
            String filename = UUID.randomUUID() + ".png";
            Path imagePath = uploadPath.resolve(filename);

            try (FileOutputStream out = new FileOutputStream(imagePath.toFile())) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }

            // 4. 저장된 파일의 웹 경로 반환
            return "/uploads/" + filename;

        } catch (Exception e) {
            throw new RuntimeException("배너 이미지 생성 및 저장 실패: " + e.getMessage(), e);
        }
    }
}
