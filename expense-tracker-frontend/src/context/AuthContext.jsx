import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (token) {
                try {
                    const res = await api.get("/auth/me");
                    setUser(res.data);
                } catch (err) {
                    console.error("Failed to fetch profile", err);
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        init();
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData || null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const updateUser = (data) => {
        setUser((u) => ({ ...u, ...(data || {}) }));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
