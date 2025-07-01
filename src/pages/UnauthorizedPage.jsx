import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
            <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Go to Homepage
            </Link>
        </div>
    );
};

export default UnauthorizedPage;