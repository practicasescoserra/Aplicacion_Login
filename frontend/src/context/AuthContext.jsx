import { createContext, useState, useEffect, useContext, useRef } from "react";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasTriedRestore = useRef(false);

    useEffect(() => {
        if (hasTriedRestore.current) return;
        hasTriedRestore.current = true

        async function tryRestoreSession() {
            try {
                const data = await apiRequest('/auth/refresh', { method: 'POST' });
                setAccessToken(data.access_token);
                const me = await  apiRequest('/users/me', {
                    headers: { Authorization: `Bearer ${data.access_token}` },
                });
                setUser(me);    
            } catch (err) {
                setAccessToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        tryRestoreSession();
    }, []);    

    async function login(identifier, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, password }),
        })
        setAccessToken(data.access_token)
        const me = await apiRequest('/users/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
        })
        setUser(me)
    }

    async function logout() {
        await apiRequest('/auth/logout', { method: 'POST' });
        setAccessToken(null);
        setUser(null);
    }

    const value = { accessToken, user, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}
