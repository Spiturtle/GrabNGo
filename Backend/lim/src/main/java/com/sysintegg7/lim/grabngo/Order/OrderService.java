package com.sysintegg7.lim.grabngo.Order;

import com.sysintegg7.lim.grabngo.Meal.MealEntity;
import com.sysintegg7.lim.grabngo.Meal.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED");

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MealRepository mealRepository;

    public OrderEntity createOrder(CreateOrderDTO dto) {
        if (dto.getOrderId() == null || dto.getOrderId().trim().isEmpty()) {
            throw new IllegalArgumentException("Order ID is required.");
        }

        if (dto.getMealId() == null) {
            throw new IllegalArgumentException("Meal is required.");
        }

        if (dto.getCustomerEmail() == null || dto.getCustomerEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required.");
        }

        if (dto.getCustomerName() == null || dto.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required.");
        }

        if (dto.getPickupTime() == null || dto.getPickupTime().trim().isEmpty()) {
            throw new IllegalArgumentException("Pickup time is required.");
        }

        if (dto.getPickupDate() == null || dto.getPickupDate().trim().isEmpty()) {
            throw new IllegalArgumentException("Pickup date is required.");
        }

        MealEntity meal = mealRepository.findById(dto.getMealId())
                .orElseThrow(() -> new IllegalArgumentException("Meal not found."));

        if (!meal.isAvailable()) {
            throw new IllegalArgumentException("This meal is currently unavailable.");
        }

        OrderEntity order = new OrderEntity();
        order.setOrderId(dto.getOrderId().trim());
        order.setMealId(meal.getId());
        order.setMealName(meal.getName());
        order.setMealPrice(meal.getPrice());
        order.setCustomerEmail(dto.getCustomerEmail().trim());
        order.setCustomerName(dto.getCustomerName().trim());
        order.setPickupDate(dto.getPickupDate().trim());
        order.setPickupTime(dto.getPickupTime().trim());
        order.setStatus("PENDING");
        order.setOrderedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAllByOrderByOrderedAtDesc();
    }

    public List<OrderEntity> getOrdersByCustomerEmail(String customerEmail) {
        if (customerEmail == null || customerEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required.");
        }

        return orderRepository.findByCustomerEmailIgnoreCaseOrderByOrderedAtDesc(customerEmail.trim());
    }

    public OrderEntity updateStatus(Long id, String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required.");
        }

        String normalizedStatus = status.trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid status.");
        }

        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found."));

        List<OrderEntity> orderGroup = orderRepository.findByOrderIdIgnoreCaseOrderByOrderedAtDesc(order.getOrderId());
        if (orderGroup.isEmpty()) {
            order.setStatus(normalizedStatus);
            return orderRepository.save(order);
        }

        orderGroup.forEach((item) -> item.setStatus(normalizedStatus));
        return orderRepository.saveAll(orderGroup).stream()
            .findFirst()
            .orElse(order);
    }
}
