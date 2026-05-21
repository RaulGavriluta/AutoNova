package com.autonova.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class OrderRequest {
    private Long userId;
    private String shippingAddress;
    private List<CartItemDto> items;

    @Getter
    @Setter
    public static class CartItemDto {
        private Long productId;
        private Integer quantity;
    }
}