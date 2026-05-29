// hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import { networkService } from "@/services/NetworkService";

export function useNetwork(): boolean {
    const [isConnected, setIsConnected] = useState<boolean>(
        networkService.isConnected()
    );

    useEffect(() => {
        const unsubscribe = networkService.subscribe(setIsConnected);
        return unsubscribe;
    }, []);

    return isConnected;
}
