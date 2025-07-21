package com.fullstack.app1.service;


import com.fullstack.app1.entity.Dataroom;
import com.fullstack.app1.repository.DataroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataroomService {

    private final DataroomRepository dataroomRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Dataroom save(String title, String content, MultipartFile file) throws IOException {
        // ✅ 업로드 디렉토리 생성 (존재하지 않으면)
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filePath = uploadDir + "/" + file.getOriginalFilename(); // 슬래시 누락 주의
        Files.copy(file.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);

        Dataroom data = new Dataroom();
        data.setTitle(title);
        data.setContent(content);
        data.setFilename(file.getOriginalFilename());
        data.setFilepath(filePath);
        data.setCreatedAt(LocalDateTime.now());

        return dataroomRepository.save(data);
    }

    public Page<Dataroom> findAll(Pageable pageable) {
        return dataroomRepository.findAll(pageable);
    }

    public Dataroom findById(Long id) {
        return dataroomRepository.findById(id).orElse(null);
    }

    public Resource download(Long id) throws IOException {
        Dataroom data = dataroomRepository.findById(id).orElseThrow();
        Path path = Paths.get(data.getFilepath());
        return new UrlResource(path.toUri());
    }

    public Dataroom update(Long id, String title, String content, MultipartFile file) throws IOException {
        Dataroom data = dataroomRepository.findById(id).orElseThrow();

        data.setTitle(title);
        data.setContent(content);

        if (file != null && !file.isEmpty()) {
            // ✅ 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filePath = uploadDir + "/" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);
            data.setFilename(file.getOriginalFilename());
            data.setFilepath(filePath);
        }

        return dataroomRepository.save(data);
    }


    public void delete(Long id) {
        dataroomRepository.deleteById(id);
    }
}
