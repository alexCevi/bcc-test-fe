import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import logo from '@/assets/logo.svg';
import { Loader } from 'lucide-react';

const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

const SignIn = () => {
    const { login, loading, error, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: zodResolver(schema)
    });

    const [emailBlurred, setEmailBlurred] = React.useState(false);
    const [passwordBlurred, setPasswordBlurred] = React.useState(false);
    const [loginSuccess, setLoginSuccess] = React.useState(false);

    // Prevent sign-in page from flashing while loading
    React.useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

    const onSubmit = async (data) => {
        const result = await login(data);
        if (result.success) {
            setLoginSuccess(true);
        } else {
            const apiError = result.error || 'Invalid credentials';
            setError('root', { message: apiError });
        }
    };

    React.useEffect(() => {
        if (loginSuccess && !loading && user) {
            if (user.role === 'EMPLOYEE') {
                navigate('/employee', { replace: true });
            } else if (user.role === 'SUPERVISOR') {
                navigate('/supervisor', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [loginSuccess, loading, user, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center w-full items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <img src={logo} alt="logo" className="max-w-sm mb-8" />
                    <Loader className="animate-spin mx-auto text-blue-500" size={36} />
                </div>
            </div>
        );
    }
    if (user) return null;

    return (
        <div className="flex justify-center w-full items-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <div className="flex flex-col justify-center items-center gap-4 mb-4 pb-4 border-b">
                    <img src={logo} className="w-[150px]" />
                    <h2 className="text-2xl font-semibold capitalize text-zinc-700 mb-2 text-center">Sign In to your account</h2>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full border px-3 py-2 rounded"
                        {...register('email')}
                        autoFocus
                        onBlur={() => setEmailBlurred(true)}
                    />
                    {errors.email && emailBlurred && <div className="text-red-600 text-xs mt-1">{errors.email.message}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded"
                        {...register('password')}
                        onBlur={() => setPasswordBlurred(true)}
                    />
                    {errors.password && passwordBlurred && <div className="text-red-600 text-xs mt-1">{errors.password.message}</div>}
                </div>
                {(errors.root || error) && (
                    <div className="mb-4 text-red-600 text-sm">{errors.root?.message || error}</div>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="flex flex-col text-gray-500 gap-2 mt-4 border-t pt-4">
                    <Link disabled to="/reset-password-request" className="hover:underline text-sm">
                        Forgot your password?
                    </Link>
                    <Link disabled to="/sign-up" className="hover:underline text-sm">
                        Don't have an account? Sign up
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SignIn;