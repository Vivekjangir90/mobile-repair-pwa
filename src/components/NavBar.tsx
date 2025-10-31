import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Pichle context se
import { auth } from '../api/firebaseConfig';
import { signOut } from 'firebase/auth';

// Navigation links ka array
const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'New Job', path: '/repair/new' },
    { name: 'Billing', path: '/billing/test' }, // 'test' ko dynamic jobId se replace karein
    { name: 'Inventory', path: '/inventory' },
    { name: 'Customers', path: '/customers' },
];

const NavBar: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <header className="bg-primary-indigo shadow-lg sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/App Title */}
                    <div className="flex-shrink-0 text-white font-extrabold text-xl">
                        🛠️ Repair Manager
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <nav className="hidden md:flex space-x-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                // Active link ko bold aur underline karein
                                className={({ isActive }) => 
                                    `px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                                        isActive 
                                            ? 'bg-indigo-700 text-white' 
                                            : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User & Logout Button */}
                    <div className="flex items-center space-x-3">
                        {currentUser && (
                            <span className="text-sm text-indigo-200 hidden sm:block">
                                Hi, Staff! ({currentUser.email})
                            </span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Navigation (Simple menu button ya bottom nav ke liye aap logic add kar sakte hain) */}
            {/* Yahan hum sirf Mobile-First approach ke liye jagah chhod rahe hain */}
        </header>
    );
};

export default NavBar;
