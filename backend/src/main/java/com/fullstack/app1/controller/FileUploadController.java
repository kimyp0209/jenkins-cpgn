package com.fullstack.app1.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/api/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        System.out.println("=== [UPLOAD 요청] ===");
        System.out.println("uploadDir = " + uploadDir);
        System.out.println("파일 이름 = " + (file != null ? file.getOriginalFilename() : "null"));

        if (file == null || file.isEmpty()) {
            System.err.println("[ERROR] 파일이 비어있거나 null입니다.");
            return ResponseEntity.badRequest().body(Map.of("message", "Empty file"));
        }

        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String basePath = new File(uploadDir).getAbsolutePath();
            Path path = Paths.get(basePath, fileName);

            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            String fileUrl = "/uploads/" + fileName;
            System.out.println("저장 경로: " + path);

            return ResponseEntity.ok(Map.of("path", fileUrl)); // ✅ 프론트 기대 형식
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "업로드 실패: " + e.getMessage()));
        }
    }


}
