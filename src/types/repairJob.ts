// DB Schema ke anusaar
export interface RepairJob {
  id?: string; // Firestore Document ID
  customerId: string; // Link to the customer
  customerName: string; // Redundant, but useful for quick views
  deviceBrand: string;
  deviceModel: string;
  problemDescription: string;
  receivedAccessories: string; // Simple text list/comma separated
  photos: string[]; // Array of Firebase Storage URLs
  estimatedCost: number;
  finalCost: number | null;
  status: 'pending' | 'in_progress' | 'completed' | 'delivered';
  createdDate: number; // Unix Timestamp
  completedDate: number | null;
}
