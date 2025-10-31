import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { getAllProducts } from '../api/firestoreService';
import { db } from '../api/firebaseConfig';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

const InventoryPage: React.FC = () => {
    const [inventory, setInventory] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState({ name: '', category: 'accessory', defaultPrice: 0, stockQuantity: 0, lowStockThreshold: 5 });

    useEffect(() => {
        // Fetch all products on mount
        const fetchInventory = async () => {
            const data = await getAllProducts();
            setInventory(data);
        };
        fetchInventory();
    }, []);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Simplified: Add new product to 'products' collection
            await addDoc(collection(db, 'products'), {
                ...newProduct,
                defaultPrice: Number(newProduct.defaultPrice),
                currentPrice: Number(newProduct.defaultPrice),
                stockQuantity: Number(newProduct.stockQuantity),
                lowStockThreshold: Number(newProduct.lowStockThreshold),
            });
            setNewProduct({ name: '', category: 'accessory', defaultPrice: 0, stockQuantity: 0, lowStockThreshold: 5 });
            // Re-fetch data
            const data = await getAllProducts();
            setInventory(data);
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };
    
    // --- Low Stock Alert Logic ---
    const lowStockItems = inventory.filter(p => 
        p.category === 'accessory' && 
        p.stockQuantity !== undefined && 
        p.lowStockThreshold !== undefined &&
        p.stockQuantity <= p.lowStockThreshold
    );

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900">Inventory Management 📦</h1>

            {/* Low Stock Alert Banner */}
            {lowStockItems.length > 0 && (
                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-md">
                    <p className="font-bold">⚠️ LOW STOCK ALERT!</p>
                    <p className="text-sm">
                        {lowStockItems.length} items are running low: {lowStockItems.map(i => i.name).join(', ')}. Please reorder.
                    </p>
                </div>
            )}

            {/* Inventory Table (Accessories and Services) */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Current Stock</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price (₹)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.map(item => (
                            <tr key={item.id} className={item.category === 'accessory' && (item.stockQuantity! <= item.lowStockThreshold!) ? 'bg-red-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category.toUpperCase()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{item.currentPrice.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                                    {item.category === 'accessory' ? item.stockQuantity : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Product/Service Form (Simplified) */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
                {/* ... Form UI based on handleAddProduct function ... */}
            </div>
        </div>
    );
};

export default InventoryPage;
