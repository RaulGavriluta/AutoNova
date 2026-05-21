package com.autonova.backend.controller;

import com.autonova.backend.model.Product;
import com.autonova.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Default Vite + React port
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Endpoint: GET /api/products
     * Returns all products in the catalog.
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * Endpoint: GET /api/products/compatible/{vehicleId}
     * Returns products compatible with the specified vehicle ID.
     */
    @GetMapping("/compatible/{vehicleId}")
    public ResponseEntity<List<Product>> getProductsByVehicle(@PathVariable Long vehicleId) {
        List<Product> compatibleProducts = productService.getProductsByVehicleCompatibility(vehicleId);
        return ResponseEntity.ok(compatibleProducts);
    }
}