import { useState, useEffect } from "react";
import {typeIncidentService, TypeIncident} from "@/services/TypeIncidentService";

/**
 * Is the link between the API and the views
 */
export function useTypeIncident() {
    const [typeIncident, setTypeIncident] = useState<TypeIncident | null>(null);
    const [typesIncidents, setTypesIncidents] = useState<TypeIncident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadIncidents();
    }, []);

    /**
     * Load the types of incidents from the api
     */
    const loadIncidents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await typeIncidentService.getAllTypesIncidents();
            setTypesIncidents(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    }

    return { typeIncident, typesIncidents, loading, error, loadIncidents };
}

