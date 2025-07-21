package com.fullstack.app1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String name;
    private String password;
    private String tel;
    private String address;
    @Column(unique = true)
    private String email;
    private String profileImg;

    @Column(nullable = false)
    private boolean social = false;

    @OneToMany(mappedBy = "questionUser", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore // 순환 참조 방지
    private List<Qna> questions;

    @OneToMany(mappedBy = "answerAdmin")
    @JsonIgnore // 순환 참조 방지
    private List<Qna> answers;

    @Column(nullable = false)
    private String role = "USER"; // 기본값

    private LocalDateTime createdAt;

    @JsonIgnore
    @OneToMany(mappedBy = "user1", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<ChatRoom> chatRoomsAsUser1;

    @JsonIgnore
    @OneToMany(mappedBy = "user2", cascade = CascadeType.REMOVE, orphanRemoval = true) // If you have a user2_id
    private Set<ChatRoom> chatRoomsAsUser2;

    @PrePersist
    public void onPrePersist() {
        if (this.role == null) this.role = "USER";
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
    }

}
