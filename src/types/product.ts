export type ProductCategory = 'service' | 'accessory';

export interface Product {
  id?: string;
  name: string;
  category: ProductCategory; // 'service' or 'accessory'
  defaultPrice: number;
  currentPrice: number;
  // Accessory-specific fields:
  stockQuantity?: number; 
  lowStockThreshold?: number;
  supplierDetails?: string;
}
