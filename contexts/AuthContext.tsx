// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from "@/utils/supabase";

// interface pour le contexte d'authentification
interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// fournisseur du contexte d'authentification
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth(); // vérifier l'état d'authentification au montage
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setIsLoggedIn(!!token); // si token existe, l'utilisateur est connecté
        } catch (error) {
            console.error('Error checking auth:', error);
        } finally {
            setIsLoading(false); // fin du chargement
        }
    };

    const login = async (email: string, password: string) => {
        // Appeler API
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        // sauvegarder le token et l'état de connexion
        if (data.session) {
            await AsyncStorage.setItem('userToken', data.session.access_token);
            await AsyncStorage.setItem('userEmail', email);
            setIsLoggedIn(true);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userEmail');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
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
