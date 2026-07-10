import { createContext, useState, useEffect, useContext } from "react";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);

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

    const value = { accessToken, user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}
