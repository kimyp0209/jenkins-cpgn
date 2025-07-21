package com.fullstack.app1.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "toss")
@Data
public class TossConfig {
    private String testClientKey;
    private String testSecretKey;
}

