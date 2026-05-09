package com.sysintegg7.lim.grabngo.Order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findAllByOrderByOrderedAtDesc();

    List<OrderEntity> findByCustomerEmailIgnoreCaseOrderByOrderedAtDesc(String customerEmail);

    List<OrderEntity> findByOrderIdIgnoreCaseOrderByOrderedAtDesc(String orderId);
}
