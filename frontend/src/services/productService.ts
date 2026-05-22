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
  },

  /**
   * Trite parametrii de filtrare direct către Spring Boot
   * ex: GET /api/products/search?search=Brembo&category=Braking%20Systems
   */
  searchAndFilterProducts: async (filters: {
    search?: string;
    category?: string;
    brand?: string;
    inStockOnly?: boolean;
    sortBy?: string;
  }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.inStockOnly) params.append('inStock', 'true');
    if (filters.sortBy) params.append('sort', filters.sortBy);

    const response = await axiosClient.get<Product[]>(`/products/search?${params.toString()}`);
    return response.data;
  }
};