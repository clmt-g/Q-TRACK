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
    role: 'operateur' | 'qualite' | 'admin' | 'direction' | null;
}

// création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// fournisseur du contexte d'authentification
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<'operateur' | 'qualite' | 'admin' | 'direction' | null>(null);

    useEffect(() => {
        checkAuth(); // vérifier l'état d'authentification au montage

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event !== 'SIGNED_IN') {
                setSession(session);
                setIsLoggedIn(!!session);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * check authentication status
     */
    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Set the session property
                setSession(session);

                // Make sure the token is valid, if its the case the user is logged in
                const token = await AsyncStorage.getItem('userToken');
                const loggedIn = !!token;
                setIsLoggedIn(loggedIn);

                // Only load the role if the user is logged in
                if (loggedIn) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .is('deleted_at', null)
                        .maybeSingle();

                    setRole(profileData?.role ?? null);
                }
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * login function
     * @param email
     * @param password
     */
    const login = async (email: string, password: string) => {
        // Appeler API
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        // error handling
        if (authError) {
            setError(authError.message);
            return;
        }

        // fetch the user profile to check if the user is not deleted
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user?.id)
            .is('deleted_at', null)
            .maybeSingle();

        if (!profileData) {
            setError('Ce compte a été désactivé');
            return;
        }

        // set the role constant to the value of the role of the user
        setRole(profileData.role);

        // sauvegarder le token et l'état de connexion
        if (authData.session) {
            setSession(authData.session);
            await AsyncStorage.setItem('userToken', authData.session.access_token);
            await AsyncStorage.setItem('userEmail', email);
            setIsLoggedIn(true);
        }
    }

    /**
     * logout function
     */
    const logout = async () => {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userEmail');
        setSession(null);
        setIsLoggedIn(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, session, error, login, logout, role }}>
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
