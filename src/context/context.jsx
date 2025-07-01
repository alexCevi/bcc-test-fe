import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, validate as apiValidate } from '@/api/authApi';


const AuthContext = createContext();

const initAuth = {
    isAuth: false,
    user: null,
    loading: true,
    token: null,
    error: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "valid-login":
            localStorage.setItem("auth-token", action.payload.token);
            console.log("valid-login", action.payload);
            return {
                ...state,
                isAuth: true,
                token: action.payload.token,
                user: action.payload.user,
                loading: false,
                error: null
            };
        case 'logged-out':
            localStorage.removeItem("auth-token");
            return { ...initAuth, loading: false };
        case 'auth-loading':
            return { ...state, loading: true };
        case 'auth-error':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initAuth);

    useEffect(() => {
        const checkSession = async () => {
            dispatch({ type: 'auth-loading' });
            const token = localStorage.getItem('auth-token');
            if (token) {
                try {
                    const res = await apiValidate();
                    console.log("checkSession", res);
                    const data = res.data;
                    dispatch({ type: 'valid-login', payload: { token, user: data } });
                } catch (err) {
                    dispatch({ type: 'logged-out' });
                }
            } else {
                dispatch({ type: 'logged-out' });
            }
        };
        checkSession();
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'auth-loading' });
        try {
            const res = await apiLogin(credentials);
            const data = res.data;
            console.log('Login data:', data);
            dispatch({ type: 'valid-login', payload: { token: data.token, user: data } });
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed';
            dispatch({ type: 'auth-error', payload: errorMsg });
            return { success: false, error: errorMsg };
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('auth-token');
            dispatch({ type: 'logged-out' });
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);