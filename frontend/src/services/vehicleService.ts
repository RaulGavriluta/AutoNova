import axiosClient from '../config/axiosClient';
import type { CarVehicle } from '../types/catalog.types';

export const vehicleService = {
  /**
   * Fetches all registered vehicles from Spring Boot: GET /api/vehicles
   */
  getVehicles: async (): Promise<CarVehicle[]> => {
    const response = await axiosClient.get<CarVehicle[]>('/vehicles');
    return response.data;
  }
};