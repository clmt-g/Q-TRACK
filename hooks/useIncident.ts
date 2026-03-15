import { useState, useEffect } from "react";
import { incidentService, Incident } from "@/services/IncidentService";

/**
 * Is the link between the API and the views
 */
export function useIncident() {
    const [incident, setIncident] = useState<Incident | null>(null);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadIncidents();
    }, [])

    /**
     * Load all incidents for the api
     */
    const loadIncidents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await incidentService.getAllIncidents();
            setIncidents(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Load an incident from the api
     * @param id
     */
    const loadIncident = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await incidentService.getIncident(id);
            setIncident(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Update an incident using the api
     * @param id_incident
     * @param description
     * @param status
     * @param id_type_incident
     */
    const updateIncident = async (id_incident: number, description: string, statut: string, id_type_incident: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await incidentService.updateIncident(id_incident, description, statut, id_type_incident);

            if (data) {
                setIncidents(prev => prev.map(t => t.id_incident === id_incident ? data : t));
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
     * Create an incident using the api
     * @param description
     * @param status
     * @param id_user
     * @param id_type_incident
     */
    const createIncident = async (description: string, statut: string, id_user: string, id_type_incident: number)=> {
        try {
            setLoading(true);
            setError(null);

            return await incidentService.createIncident(description, statut, id_user, id_type_incident);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Delete an incident using the api
     * @param id
     */
    const deleteIncident = async (id: number) =>  {
        try {
            setLoading(true);
            setError(null);
            await incidentService.deleteIncident(id);
            setIncidents(prev => prev.filter(t => t.id_incident !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return { incident, incidents, loading, error, loadIncidents, loadIncident, updateIncident, createIncident, deleteIncident };
}