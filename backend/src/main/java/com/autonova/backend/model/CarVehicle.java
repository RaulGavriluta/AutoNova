package com.autonova.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "car_vehicles")
@Getter
@Setter
@NoArgsConstructor // Lombok generates a no-args constructor required by JPA
@AllArgsConstructor // Lombok generates a constructor with all fields
public class CarVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(length = 30)
    private String generation;

    @Column(name = "year_start", nullable = false)
    private Integer yearStart;

    @Column(name = "year_end")
    private Integer yearEnd;

    // JsonIgnore protects against infinite loops when serializing to JSON
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToMany(mappedBy = "compatibleVehicles")
    private Set<Product> products = new HashSet<>();
}