package com.autonova.backend.controller;

import com.autonova.backend.model.CarVehicle;
import com.autonova.backend.service.CarVehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class CarVehicleController {

    private final CarVehicleService carVehicleService;

    @Autowired
    public CarVehicleController(CarVehicleService carVehicleService) {
        this.carVehicleService = carVehicleService;
    }

    /**
     * Endpoint: GET /api/vehicles
     * Used by React to know what cars are available for filtering.
     */
    @GetMapping
    public ResponseEntity<List<CarVehicle>> getAllVehicles() {
        return ResponseEntity.ok(carVehicleService.getAllVehicles());
    }
}