package com.fullstack.app1.controller;

import com.fullstack.app1.entity.Dataroom;
import com.fullstack.app1.service.DataroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/datarooms")
public class DataroomController {

    private final DataroomService dataroomService;

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex != -1) ? filename.substring(dotIndex + 1) : "";
    }

    @PostMapping
    public ResponseEntity<Dataroom> upload(
            @RequestParam String title,
            @RequestParam String content,
            @RequestPart MultipartFile file) throws IOException {
        return ResponseEntity.ok(dataroomService.save(title, content, file));
    }

    @GetMapping
    public ResponseEntity<Page<Dataroom>> pagedList(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(dataroomService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dataroom> detail(@PathVariable("id") Long id) {
        Dataroom data = dataroomService.findById(id);
        return data != null ? ResponseEntity.ok(data) : ResponseEntity.notFound().build();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable("id") Long id) throws IOException {
        Resource resource = dataroomService.download(id);
        Dataroom data = dataroomService.findById(id);
        String filename = data.getFilename();
        String extension = getFileExtension(filename).toLowerCase();

        // 파일 MIME 타입 결정
        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(Files.probeContentType(resource.getFile().toPath()));
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        // ✅ PDF & 이미지 파일은 inline, 그 외는 attachment
        boolean isInline = extension.equals("pdf") ||
                extension.equals("jpg") || extension.equals("jpeg") ||
                extension.equals("png") || extension.equals("gif") ||
                extension.equals("webp");

        String disposition = isInline ? "inline" : "attachment";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + filename + "\"")
                .body(resource);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Dataroom> update(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) MultipartFile file) throws IOException {

        return ResponseEntity.ok(dataroomService.update(id, title, content, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        dataroomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
