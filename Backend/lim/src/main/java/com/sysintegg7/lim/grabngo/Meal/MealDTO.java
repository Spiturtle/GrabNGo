package com.sysintegg7.lim.grabngo.Meal;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MealDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private Boolean available;
}
