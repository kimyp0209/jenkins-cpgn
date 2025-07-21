package com.fullstack.app1.controller;

import com.fullstack.app1.entity.Notice;
import com.fullstack.app1.repository.NoticeRepository;
import com.fullstack.app1.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;
    private final NoticeRepository noticeRepository;

    // 전체 공지 목록
    @GetMapping
    public Page<Notice> getNotices(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return noticeService.getNotices(pageable);
    }
    
    // 최신 3개만
    @GetMapping("/latest")
    public ResponseEntity<List<Map<String, Object>>> getLatestNotices() {
        List<Notice> notices = noticeRepository.findTop3ByOrderByCreatedAtDesc();

        // 필요한 필드만 가공해서 보냄
        List<Map<String, Object>> result = notices.stream().map(n -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getId());
            map.put("title", n.getTitle());
            map.put("createdAt", n.getCreatedAt());
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    // 단일 공지 상세
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNotice(@PathVariable("id") Long id) {
        return noticeService.getNotice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 공지 등록
    @PostMapping
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        Notice saved = noticeService.createNotice(notice);
        return ResponseEntity.ok(saved);
    }

    // 공지 수정
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable("id") Long id, @RequestBody Notice notice) {
        Notice updated = noticeService.updateNotice(id, notice);
        return ResponseEntity.ok(updated);
    }

    // 공지 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable("id") Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
