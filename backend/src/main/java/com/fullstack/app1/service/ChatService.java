package com.fullstack.app1.service;

import com.fullstack.app1.dto.ChatCompletionRequest;
import com.fullstack.app1.dto.ChatCompletionResponse;
import com.fullstack.app1.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final WebClient webClient;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    public String replyTo(String userInput) {
        try {
            // ✅ 사전 정의된 FAQ 매핑
            Map<String, String> presetAnswers = Map.of(
                    "배송은 얼마나 걸리나요?", "주말, 공휴일 제외 평균 1~3일 이내에 배송됩니다.",
                    "교환/반품은 어떻게 하나요?", "상품 수령일 기준 7일 이내 신청 시 가능합니다.",
                    "비회원도 주문할 수 있나요?", "비회원은 주문이 불가능합니다. 로그인 후 이용해주세요."
            );

            if (presetAnswers.containsKey(userInput.trim())) {
                return presetAnswers.get(userInput.trim()); // ✅ 내가 작성한 답변 반환
            }

            // ✅ 그 외는 GPT에 전달
            String prompt = """
        너는 의류 쇼핑몰의 고객센터 챗봇이야.
        사용자의 질문에 대해 친절하고 간단하게 한국어로 답변해줘.
        질문: %s
        """.formatted(userInput);

            ChatCompletionRequest chatRequest = new ChatCompletionRequest(
                    "gpt-4o",
                    List.of(new ChatMessage("user", prompt))
            );

            ChatCompletionResponse chatResponse = webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(chatRequest)
                    .retrieve()
                    .bodyToMono(ChatCompletionResponse.class)
                    .block();

            return (chatResponse != null && chatResponse.choices() != null && !chatResponse.choices().isEmpty())
                    ? chatResponse.choices().get(0).message().content()
                    : "❌ GPT 응답이 없습니다.";

        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ 오류 발생: " + e.getMessage();
        }
    }

}
