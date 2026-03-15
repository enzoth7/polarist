import React, { createContext, useContext, useState, ReactNode } from "react";

type AuthState = "loading" | "guest" | "authenticated";

interface AuthContextType {
    status: AuthState;
    loginAsGoogle: () => void;
    loginAsGuest: () => void;
    logout: () => void;
    requireAuth: (action: () => void) => () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // MVP: Iniciar siempre en loading o deslogueado para mostrar el Login
    const [status, setStatus] = useState<AuthState>("loading");

    // En un MVP simularemos que la carga se resuelve a deslogueado rápido
    React.useEffect(() => {
        setTimeout(() => setStatus("loading"), 500); // Simulando chequeo
    }, []);

    const loginAsGoogle = () => setStatus("authenticated");
    const loginAsGuest = () => setStatus("guest");
    const logout = () => setStatus("loading"); // Hack MVP: vuelve al login screen

    // Wrapper para funciones que requieren auth
    const requireAuth = (action: () => void) => {
        return () => {
            if (status === "authenticated") {
                action();
            } else {
                // Si es guest, despachamos un evento custom para que un toast/modal global lo avise
                window.dispatchEvent(new CustomEvent("polarist-auth-required"));
            }
        };
    };

    return (
        <AuthContext.Provider value={{ status, loginAsGoogle, loginAsGuest, logout, requireAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return ctx;
};
