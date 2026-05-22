export interface Product {
  id: number;
  sku: string;
  partBrand: string;      
  name: string;
  category: string;
  price: number;          
  stockQuantity: number;  
  imageUrl?: string;      
}

export interface VehicleFilter {
  brand: string;
  model: string;
}