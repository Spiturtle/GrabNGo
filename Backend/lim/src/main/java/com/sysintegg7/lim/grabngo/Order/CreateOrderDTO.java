package com.sysintegg7.lim.grabngo.Order;

import lombok.Data;

@Data
public class CreateOrderDTO {
    private String orderId;
    private Long mealId;
    private String customerEmail;
    private String customerName;
    private String pickupDate;
    private String pickupTime;
}
