import { createContext, useContext, useState, ReactNode } from 'react';

type ImpersonatedUser = {
    id: string;
    nom: string;
    prenom: string;
    role: string;
};

type ImpersonationContextType = {
    impersonatedUser: ImpersonatedUser | null;
    startImpersonation: (user: ImpersonatedUser) => void;
    stopImpersonation: () => void;
    isImpersonating: boolean;
};

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export function ImpersonationProvider({ children }: { children: ReactNode }) {
    const [impersonatedUser, setImpersonatedUser] = useState<ImpersonatedUser | null>(null);

    const startImpersonation = (user: ImpersonatedUser) => setImpersonatedUser(user);
    const stopImpersonation = () => setImpersonatedUser(null);

    return (
        <ImpersonationContext.Provider value={{
            impersonatedUser,
            startImpersonation,
            stopImpersonation,
            isImpersonating: impersonatedUser !== null,
        }}>
            {children}
        </ImpersonationContext.Provider>
    );
}

export function useImpersonation() {
    const ctx = useContext(ImpersonationContext);
    if (!ctx) throw new Error('useImpersonation must be used within ImpersonationProvider');
    return ctx;
}
