package com.fullstack.app1.dto;

import java.util.List;

public record ChatCompletionRequest(
        String model,
        List<ChatMessage> messages,
        Double temperature,
        Integer max_tokens,
        Double top_p,
        Double frequency_penalty,
        Double presence_penalty
) {
    public ChatCompletionRequest(String model, List<ChatMessage> messages) {
        this(model, messages, 0.7, 1000, 1.0, 0.0, 0.0);
    }
}
