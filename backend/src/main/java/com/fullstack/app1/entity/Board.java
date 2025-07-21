package com.fullstack.app1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length=200)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private int hits;

    @Column(nullable = false)
    private LocalDateTime resdate;

    @PrePersist
    public void prePersist() {
        this.resdate = this.resdate == null ? LocalDateTime.now() : this.resdate;
        this.hits = this.hits == 0 ? 0 : this.hits;
    }
}
