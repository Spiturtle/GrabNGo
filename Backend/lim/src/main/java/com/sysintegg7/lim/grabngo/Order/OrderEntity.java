package com.sysintegg7.lim.grabngo.Order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String orderId;

    @Column(nullable = false)
    private Long mealId;

    @Column(nullable = false, length = 120)
    private String mealName;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal mealPrice;

    @Column(nullable = false, length = 180)
    private String customerEmail;

    @Column(nullable = false, length = 180)
    private String customerName;

    @Column(length = 30)
    private String pickupTime;

    @Column(length = 30)
    private String pickupDate;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(nullable = false)
    private LocalDateTime orderedAt;
}
