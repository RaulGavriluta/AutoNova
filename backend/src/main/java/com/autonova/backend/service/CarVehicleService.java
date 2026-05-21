package com.autonova.backend.service;

import com.autonova.backend.model.CarVehicle;
import com.autonova.backend.repository.CarVehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CarVehicleService {

    private final CarVehicleRepository carVehicleRepository;

    @Autowired
    public CarVehicleService(CarVehicleRepository carVehicleRepository) {
        this.carVehicleRepository = carVehicleRepository;
    }

    /**
     * Returns all vehicles so React can populate the search dropdowns.
     */
    public List<CarVehicle> getAllVehicles() {
        return carVehicleRepository.findAll();
    }
}