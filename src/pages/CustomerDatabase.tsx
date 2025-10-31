import React, { useState } from 'react';
import { Customer } from '../types/customer';
import { RepairJob } from '../types/repairJob';
import { db } from '../api/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const CustomerDatabase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [repairHistory, setRepairHistory] = useState<RepairJob[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setCustomer(null);
        setRepairHistory([]);

        try {
            // 1. Search Customer by Phone Number (or Name)
            const customersRef = collection(db, 'customers');
            // Check if input is likely a phone number (e.g., all digits)
            const isPhoneSearch = /^\d+$/.test(searchTerm.trim()); 
            
            let q;
            if (isPhoneSearch) {
                q = query(customersRef, where('phone', '==', searchTerm.trim()));
            } else {
                // Simplified text search (Firestore does not support true fuzzy search)
                q = query(customersRef, where('name', '==', searchTerm.trim()));
            }

            const customerSnapshot = await getDocs(q);
            
            if (!customerSnapshot.empty) {
                const custData = customerSnapshot.docs[0].data() as Omit<Customer, 'id'>;
                const cust: Customer = { id: customerSnapshot.docs[0].id, ...custData };
                setCustomer(cust);

                // 2. Fetch Repair History using customerId
                const repairQ = query(
                    collection(db, 'repairJobs'),
                    where('customerId', '==', cust.id!)
                );
                const repairSnapshot = await getDocs(repairQ);
                const historyData = repairSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RepairJob));
                setRepairHistory(historyData);
            } else {
                alert('Customer not found.');
            }
        } catch (error) {
            console.error("Search error: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900">Customer Database 👥</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-4 p-4 bg-white rounded-xl shadow-lg">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Phone Number or Name..."
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                <button type="submit" disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {customer && (
                <div className="space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                        <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
                        <p className="text-lg text-gray-600">📞 {customer.phone} | 📧 {customer.email}</p>
                        <p className="text-sm text-gray-500">Address: {customer.address || 'N/A'}</p>
                    </div>

                    {/* Repair History */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Repair History ({repairHistory.length} Jobs)</h2>
                        <ul className="divide-y divide-gray-200">
                            {repairHistory.map(job => (
                                <li key={job.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-indigo-600">{job.deviceBrand} {job.deviceModel}</p>
                                        <p className="text-sm text-gray-500">{job.problemDescription.substring(0, 50)}...</p>
                                    </div>
                                    <StatusIndicator status={job.status} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDatabase;
