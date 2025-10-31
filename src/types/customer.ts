export interface Customer {
  id?: string; // Firestore Document ID
  name: string;
  phone: string;
  email: string;
  address?: string;
  createdDate: number; // Unix Timestamp
}
