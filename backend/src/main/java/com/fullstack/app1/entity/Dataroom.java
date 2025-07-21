package com.fullstack.app1.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "datarooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dataroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String filename;
    private String filepath;

    private LocalDateTime createdAt = LocalDateTime.now();
}
