package com.fullstack.app1.service;

import com.fullstack.app1.entity.Notice;
import com.fullstack.app1.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    /** 전체 공지 목록 */
    public Page<Notice> getNotices(Pageable pageable) {
        return noticeRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    /** 단일 공지 조회 */
    public Optional<Notice> getNotice(Long id) {
        return noticeRepository.findById(id);
    }

    /** 공지 등록 */
    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    /** 공지 수정 */
    public Notice updateNotice(Long id, Notice updated) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지 없음: " + id));

        notice.setTitle(updated.getTitle());
        notice.setContent(updated.getContent());
        // 필요 시 updatedAt 필드 추가하여 갱신

        return noticeRepository.save(notice);
    }

    /** 공지 삭제 */
    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}
