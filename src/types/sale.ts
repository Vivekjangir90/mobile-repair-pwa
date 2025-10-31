export interface SaleItem {
  name: string;
  price: number; // Final price charged
  quantity: number;
  isService: boolean; // True if service, False if accessory/product
}

export interface Sale {
  id?: string;
  repairJobId: string; // Link to the repairJobs collection
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subTotal: number;
  gstRate: number; // e.g., 0.18 for 18%
  gstAmount: number;
  totalAmount: number; // Final amount
  paymentMethod: string; // Cash, Card, UPI, etc.
  invoiceNumber: string;
  date: number; // Unix Timestamp of sale
}
