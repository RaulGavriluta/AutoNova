package com.autonova.backend.service;

import com.autonova.backend.dto.OrderRequest;
import com.autonova.backend.model.Order;
import com.autonova.backend.model.OrderItem;
import com.autonova.backend.model.Product;
import com.autonova.backend.model.User;
import com.autonova.backend.repository.OrderRepository;
import com.autonova.backend.repository.ProductRepository;
import com.autonova.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /**
     * Places a new order, validates stock, updates catalog, and saves to DB.
     */
    @Transactional
    public Order createOrder(OrderRequest request) {
        // Find the user who is placing the order
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        // Create the main Order header
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("PENDING");

        BigDecimal totalOrderPrice = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // Process each item from the frontend shopping cart
        for (OrderRequest.CartItemDto cartItem : request.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + cartItem.getProductId()));

            // Validation: Do we have enough parts in stock?
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName() + ". Available: " + product.getStockQuantity());
            }

            // Update stock in the catalog
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            // Create the historical order item line
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice()); // Freeze the price!

            // Calculate subtotal for this item (price * quantity)
            BigDecimal itemSubtotal = product.getPrice().multiply(new BigDecimal(cartItem.getQuantity()));
            totalOrderPrice = totalOrderPrice.add(itemSubtotal);

            orderItems.add(orderItem);
        }

        // 4. Bind the calculated prices and items back to the parent Order
        order.setTotalPrice(totalOrderPrice);
        order.getItems().addAll(orderItems);

        // 5. Save the order (CascadeType.ALL will automatically save the items too)
        return orderRepository.save(order);
    }

    /**
     * Retrieves all orders for a specific user to display in their React profile.
     */
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}