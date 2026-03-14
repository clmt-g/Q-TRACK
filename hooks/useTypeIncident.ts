import { useState, useEffect } from "react";
import {typeIncidentService, TypeIncident} from "@/services/TypeIncidentService";

/**
 * Is the link between the API and the views
 */
export function useTypeIncident() {
    const [typeIncident] = useState<TypeIncident | null>(null);
    const [typesIncidents, setTypesIncidents] = useState<TypeIncident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTypesIncidents();
    }, []);

    /**
     * Load the types of incidents from the api
     */
    const loadTypesIncidents = async () => {
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

    /**
     * Make the link between the view and the api to update a type of incident
     * @param id
     * @param libelle
     * @param description
     * @param actif
     */
    const updateTypeIncident = async (id: number, libelle: string, description: string, actif: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const data = await typeIncidentService.upadteTypeIncident(id, libelle, description, actif);
            if (data) {
                setTypesIncidents(prev => prev.map(t => t.id_type_incident === id ? data : t));
            }
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            console.error('Error loading incident type:', err);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Make the link between the view and the api to create a type of incident
     * @param libelle
     * @param description
     * @param actif
     */
    const createTypeIncident = async (libelle: string, description: string, actif: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const data = await typeIncidentService.createTypeIncident(libelle, description, actif);
            if (data) {
                setTypesIncidents(prev => [data, ...prev]);
            }
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Make the link between the view and the api to delete a type of incident
     * @param id
     */
    const deleteTypeIncident = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await typeIncidentService.deleteTypeIncident(id);
            setTypesIncidents(prev => prev.filter(t => t.id_type_incident !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return { typeIncident, typesIncidents, loading, error, loadTypesIncidents, updateTypeIncident, createTypeIncident, deleteTypeIncident };
}

