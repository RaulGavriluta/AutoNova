package com.autonova.backend.repository;

import com.autonova.backend.model.CarVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarVehicleRepository extends JpaRepository<CarVehicle, Long> {

    List<CarVehicle> findByBrand(String brand);
}