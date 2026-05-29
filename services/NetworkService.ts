// services/networkService.ts
import NetInfo, {
    NetInfoState,
    NetInfoSubscription,
} from '@react-native-community/netinfo';

type Listener = (isConnected: boolean) => void;

class NetworkService {
    private listeners: Set<Listener> = new Set();
    private currentState: boolean = true;
    private subscription: NetInfoSubscription | null = null;

    /**
     * Démarre la surveillance du réseau du téléphone.
     * À appeler une seule fois au démarrage de l'app.
     */
    init() {
        this.subscription = NetInfo.addEventListener((state: NetInfoState) => {
            const isConnected = state.isConnected ?? false;
            if (isConnected !== this.currentState) {
                this.currentState = isConnected;
                this.notify(isConnected);
            }
        });

        NetInfo.fetch().then((state: NetInfoState) => {
            this.currentState = state.isConnected ?? false;
            this.notify(this.currentState);
        });
    }

    /**
     * Arrête la surveillance du réseau.
     * À appeler quand l'app se ferme pour éviter les fuites mémoire.
     */
    destroy() {
        this.subscription?.();
        this.subscription = null;
    }

    /**
     * Enregistre une fonction à appeler à chaque changement de connexion.
     * Retourne une fonction de désinscription à appeler quand le composant est démonté.
     */
    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        listener(this.currentState);
        return () => this.listeners.delete(listener);
    }

    /**
     * Retourne l'état de connexion actuel sans s'abonner aux changements.
     * Utile pour une vérification ponctuelle avant un appel API par exemple.
     */
    isConnected(): boolean {
        return this.currentState;
    }

    /**
     * Appelle toutes les fonctions enregistrées via subscribe() avec le nouvel état.
     */
    private notify(isConnected: boolean) {
        this.listeners.forEach((listener) => listener(isConnected));
    }
}

export const networkService = new NetworkService();
