package com.fullstack.app1.service;

import com.fullstack.app1.entity.Board;
import com.fullstack.app1.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;

    public List<Board> getBoardList() {
        return boardRepository.findAll();
    }

    public Optional<Board> getBoard(Long id) {
        return boardRepository.findById(id);
    }

    public Board saveBoard(Board board) {
        return boardRepository.save(board);
    }

    public Board updateBoard(Board board) {
        Board bd = boardRepository.findById(board.getId()).orElseThrow();
        bd.setTitle(board.getTitle());
        bd.setContent(board.getContent());
        return boardRepository.save(bd);
    }

    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    public Board increaseHits(Long id){
        Board board = boardRepository.findById(id).orElse(null);
        board.setHits(board.getHits() + 1);
        return boardRepository.save(board);
    }
}
