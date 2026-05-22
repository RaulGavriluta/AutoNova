import axiosClient from '../config/axiosClient';
import { type Product } from '../types/catalog.types';

export const productService = {
  /**
   * Fetches all products from Spring Boot: GET /api/products
   * Used on the homepage to display the featured selection.
   */
  getProducts: async (): Promise<Product[]> => {
    const response = await axiosClient.get<Product[]>('/products');
    return response.data;
  },

  /**
   * Fetch a single product by ID
   */
  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosClient.get<Product>(`/products/${id}`);
    return response.data;
  }
};