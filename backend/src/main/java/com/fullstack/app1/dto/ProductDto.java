package com.fullstack.app1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private String name;
    private String category;
    private int price;
    private int percent;
    private String description;
}
