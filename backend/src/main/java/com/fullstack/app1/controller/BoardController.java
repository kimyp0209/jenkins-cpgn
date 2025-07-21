package com.fullstack.app1.controller;

import com.fullstack.app1.entity.Board;
import com.fullstack.app1.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @GetMapping("/list")
    public List<Board> getBoardList() {
        return boardService.getBoardList();
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Board> getBoard(@PathVariable("id") Long id) {
        return boardService.getBoard(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/insert")
    public Board insertBoard(@RequestBody Board board) {
        return boardService.saveBoard(board);

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable("id") Long id, @RequestBody Board board) {
        board.setId(id);
        Board bd = boardService.updateBoard(board);
        return ResponseEntity.ok(bd);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable("id") Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }
}
