import { db } from './firebaseConfig';
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { Customer } from '../types/customer';
import { RepairJob } from '../types/repairJob';
import { Product } from '../types/product';
import { Sale } from '../types/sale';

// --- Customer CRUD ---

export const getCustomerByPhone = async (phone: string): Promise<Customer | null> => {
  const customersRef = collection(db, 'customers');
  const q = query(customersRef, where('phone', '==', phone));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    // Assuming phone number is unique
    const docData = snapshot.docs[0].data();
    return { id: snapshot.docs[0].id, ...docData } as Customer;
  }
  return null;
};

export const createOrGetCustomer = async (data: Omit<Customer, 'createdDate' | 'id'>): Promise<string> => {
  const existingCustomer = await getCustomerByPhone(data.phone);
  if (existingCustomer) {
    return existingCustomer.id!;
  }
  const docRef = await addDoc(collection(db, 'customers'), {
    ...data,
    createdDate: Date.now(),
  });
  return docRef.id;
};

// --- Repair Job Status Update ---

export const updateRepairJobStatus = async (jobId: string, status: RepairJob['status']): Promise<void> => {
  const jobRef = doc(db, 'repairJobs', jobId);
  await updateDoc(jobRef, { 
    status,
    completedDate: status === 'completed' || status === 'delivered' ? Date.now() : null,
  });
};

// --- Products/Inventory CRUD ---

export const getAllProducts = async (): Promise<Product[]> => {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
};

// --- Sales/Billing ---

export const createSale = async (saleData: Omit<Sale, 'id' | 'date'>): Promise<string> => {
    // Note: Invoice Number generation logic would be complex in a real app (e.g., using Firebase Functions)
    // Here we use a simple placeholder.
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`; 
    
    const docRef = await addDoc(collection(db, 'sales'), {
        ...saleData,
        invoiceNumber,
        date: Date.now(),
    });

    // Optionally update inventory stock here (in a real app, use a transaction/function)
    // await updateStockAfterSale(saleData.items); 

    return docRef.id;
};
