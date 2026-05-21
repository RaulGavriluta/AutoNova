package com.autonova.backend.controller;

import com.autonova.backend.dto.OrderRequest;
import com.autonova.backend.model.Order;
import com.autonova.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Endpoint: POST /api/orders
     * Places a new order from the React checkout cart.
     */
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request) {
        Order savedOrder = orderService.createOrder(request);
        return ResponseEntity.ok(savedOrder);
    }

    /**
     * Endpoint: GET /api/orders/user/{userId}
     * Returns order history for a specific client.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> history = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(history);
    }
}