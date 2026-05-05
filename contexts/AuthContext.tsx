// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from "@/utils/supabase";
import { Session } from '@supabase/supabase-js';

// interface pour le contexte d'authentification
interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    session?: Session | null;
    error?: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// fournisseur du contexte d'authentification
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth(); // vérifier l'état d'authentification au montage

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * check authentication status
     */
    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setIsLoggedIn(!!token); // si token existe, l'utilisateur est connecté
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setIsLoading(false); // fin du chargement
        }
    };

    /**
     * login function
     * @param email
     * @param password
     */
    const login = async (email: string, password: string) => {
        // Appeler API
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        // error handling
        if (error) {
            setError(error.message);
            return;
        }

        // sauvegarder le token et l'état de connexion
        if (data.session) {
            setSession(data.session);
            await AsyncStorage.setItem('userToken', data.session.access_token);
            await AsyncStorage.setItem('userEmail', email);
            setIsLoggedIn(true);
        }
    };

    /**
     * logout function
     */
    const logout = async () => {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userEmail');
        setSession(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, session, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// hook pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
