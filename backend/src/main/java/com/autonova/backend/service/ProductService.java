package com.autonova.backend.service;

import com.autonova.backend.model.Product;
import com.autonova.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Retrieves all products available in the shop catalog.
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Filters products that are compatible with a specific vehicle ID.
    public List<Product> getProductsByVehicleCompatibility(Long vehicleId) {
        List<Product> allProducts = productRepository.findAll();

        return allProducts.stream()
                .filter(product -> product.getCompatibleVehicles().stream()
                        .anyMatch(vehicle -> vehicle.getId().equals(vehicleId)))
                .collect(Collectors.toList());
    }
}