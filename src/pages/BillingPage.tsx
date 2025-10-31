import React, { useState, useEffect } from 'react';
import { SaleItem, Sale } from '../types/sale';
import { RepairJob } from '../types/repairJob';
import { Product } from '../types/product';
import { createSale, getAllProducts, updateRepairJobStatus } from '../api/firestoreService';

// Assume you fetch the selected RepairJob based on URL param or Context
const DUMMY_JOB: RepairJob = {
  // ... job data
  id: "JOB-789", customerId: "CUST-101", customerName: "Ravi Sharma", 
  deviceBrand: 'Apple', deviceModel: 'iPhone 13', 
  status: 'in_progress', estimatedCost: 5000, 
  // ... other fields
} as RepairJob; 


const BillingPage = () => {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const GST_RATE = 0.18; // 18%

  useEffect(() => {
    // Fetch available products and services
    getAllProducts().then(setProducts);
  }, []);

  const handleAddItem = (product: Product) => {
    const newItem: SaleItem = {
      name: product.name,
      price: product.currentPrice,
      quantity: 1,
      isService: product.category === 'service',
    };
    setItems(prev => [...prev, newItem]);
  };

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gstAmount = subTotal * GST_RATE;
    const totalAmount = subTotal + gstAmount;
    return { subTotal, gstAmount, totalAmount };
  };

  const handleCheckout = async () => {
    const { subTotal, gstAmount, totalAmount } = calculateTotals();

    const saleData: Omit<Sale, 'id' | 'date'> = {
      repairJobId: DUMMY_JOB.id!,
      customerId: DUMMY_JOB.customerId,
      customerName: DUMMY_JOB.customerName,
      items,
      subTotal,
      gstRate: GST_RATE,
      gstAmount,
      totalAmount,
      paymentMethod,
    };

    try {
      // 1. Sale entry banao
      const saleId = await createSale(saleData);
      
      // 2. Repair Job Status update karo
      await updateRepairJobStatus(DUMMY_JOB.id!, 'completed');
      
      alert(`Invoice ${saleId} created successfully! Job status updated to Completed.`);
      // Redirect to Invoice View/Print
    } catch (error) {
      console.error("Billing failed: ", error);
      alert('Failed to process payment.');
    }
  };

  const { subTotal, gstAmount, totalAmount } = calculateTotals();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Billing for Job: {DUMMY_JOB.id}</h1>
      
      {/* 1. Item Selection (Simplified) */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">Add Item/Service</h2>
        <div className="flex flex-wrap gap-2">
          {products.map(p => (
            <button key={p.id} onClick={() => handleAddItem(p)}
              className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
              + {p.name} ({p.category.toUpperCase()})
            </button>
          ))}
        </div>
      </div>

      {/* 2. Billing Items Table */}
      <div className="bg-white p-6 shadow-xl rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
        {/* Table structure would go here with input fields for Quantity and Price */}
        
        <div className="mt-4 text-right space-y-2 border-t pt-4">
          <p>Sub Total: **₹{subTotal.toFixed(2)}**</p>
          <p>GST ({GST_RATE * 100}%): **₹{gstAmount.toFixed(2)}**</p>
          <p className="text-2xl font-bold text-red-600">Total: **₹{totalAmount.toFixed(2)}**</p>
        </div>
      </div>
      
      {/* 3. Payment & Checkout */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                  className="p-2 border rounded">
            <option value="">Select Method</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>
        
        <button onClick={handleCheckout} disabled={!paymentMethod || items.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:opacity-50 transition">
          Process Payment & Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default BillingPage;
