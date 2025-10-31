import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import { useAuth } from '../context/AuthContext'; // To access loading state

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Check if user is already logged in

    // Redirect if already logged in
    if (currentUser) {
        // User is logged in, redirect to Dashboard
        return <Navigate to="/" replace />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Attempt to sign in the user using Firebase Auth
            await signInWithEmailAndPassword(auth, email, password);
            
            // Success! Navigate to the Dashboard
            navigate('/');
        } catch (err: any) {
            // Handle Firebase authentication errors
            console.error("Login Error:", err.message);
            
            let errorMessage = "Login failed. Please check your credentials.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                errorMessage = "Invalid email or password.";
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "Email format is incorrect.";
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
                
                <h2 className="text-3xl font-extrabold text-center text-indigo-700">
                    Staff Login 🛠️
                </h2>
                <p className="text-center text-gray-500">
                    Access your Repair Management System
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="staff@shopname.com"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-md border border-red-300">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
                    >
                        {loading ? 'Logging In...' : 'Sign In'}
                    </button>
                </form>

                {/* Optional: Link for Forgot Password / Register (for security, staff should be registered by an admin) */}
                <div className="text-center">
                    <Link to="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
