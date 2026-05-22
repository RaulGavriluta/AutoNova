export interface Product {
  id: number;
  sku: string;
  partBrand: string;      
  name: string;
  category: string;
  price: number;          
  stockQuantity: number;  
  imageUrl?: string; 
  compatibleVehicles?: CarVehicle[];  
}

export interface CarVehicle {
  id: number;
  brand: string;
  model: string;
  generation?: string;
  yearStart: number;
  yearEnd?: number;
}
