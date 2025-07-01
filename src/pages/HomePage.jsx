import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/context';
import { Loader } from 'lucide-react';

const HomePage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin text-blue-500" size={36} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    if (user.role === 'EMPLOYEE') {
        return <Navigate to="/employee" replace />;
    }

    if (user.role === 'SUPERVISOR') {
        return <Navigate to="/supervisor" replace />;
    }

    return <div>HomePage</div>;
};

export default HomePage;