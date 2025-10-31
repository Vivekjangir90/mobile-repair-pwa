import React, { useState, useEffect } from 'react';
import { db } from '../api/firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { RepairJob } from '../types/repairJob';
import { Customer } from '../types/customer';
import { Sale } from '../types/sale';
import StatusIndicator from '../components/StatusIndicator';

// Component to display a single metric (reusable)
const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
    <div className={`p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transform transition duration-300 hover:scale-[1.02]`}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ todayRepairs: 0, pendingJobs: 0, totalRevenue: 0 });
    const [recentJobs, setRecentJobs] = useState<RepairJob[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const startOfDayTimestamp = today.getTime();

            // 1. Fetch Today's Repairs
            const todayRepairQ = query(
                collection(db, 'repairJobs'),
                where('createdDate', '>=', startOfDayTimestamp)
            );
            const todayRepairSnapshot = await getDocs(todayRepairQ);
            
            // 2. Fetch Pending Jobs
            const pendingJobsQ = query(
                collection(db, 'repairJobs'),
                where('status', 'in', ['pending', 'in_progress'])
            );
            const pendingJobsSnapshot = await getDocs(pendingJobsQ);
            
            // 3. Fetch Revenue (Simple: Today's Sales Total)
            const todaySalesQ = query(
                collection(db, 'sales'),
                where('date', '>=', startOfDayTimestamp)
            );
            const todaySalesSnapshot = await getDocs(todaySalesQ);
            const totalRevenue = todaySalesSnapshot.docs.reduce((sum, doc) => sum + (doc.data() as Sale).totalAmount, 0);

            // 4. Fetch Recent Jobs (e.g., last 5 created)
            const recentJobsQ = query(
                collection(db, 'repairJobs'),
                orderBy('createdDate', 'desc'),
                limit(5)
            );
            const recentJobsSnapshot = await getDocs(recentJobsQ);
            const recentJobsData = recentJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RepairJob));
            
            setStats({
                todayRepairs: todayRepairSnapshot.size,
                pendingJobs: pendingJobsSnapshot.size,
                totalRevenue: totalRevenue,
            });
            setRecentJobs(recentJobsData);
        };

        fetchData();
    }, []);

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900">Dashboard 🏠</h1>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Today's New Jobs" value={stats.todayRepairs} color="border-indigo-500" />
                <StatCard title="Total Pending Jobs" value={stats.pendingJobs} color="border-red-500" />
                <StatCard title="Today's Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} color="border-green-500" />
            </div>
            
            {/* Recent Repair Jobs List */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Repair Jobs</h2>
                <ul className="divide-y divide-gray-200">
                    {recentJobs.map(job => (
                        <li key={job.id} className="py-4 flex justify-between items-center">
                            <div>
                                <p className="text-lg font-bold text-indigo-600">{job.customerName}</p>
                                <p className="text-sm text-gray-500">{job.deviceBrand} {job.deviceModel} ({job.problemDescription.substring(0, 30)}...)</p>
                            </div>
                            <StatusIndicator status={job.status} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
