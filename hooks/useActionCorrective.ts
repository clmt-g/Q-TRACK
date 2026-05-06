import { useState, useEffect } from "react";
import { actionCorrectiveService, ActionCorrective } from "@/services/ActionCorrectiveService";

/**
 * Is the link between the API and the views
 */
export function useActionCorrective() {
    const [actionCorrective, setActionCorrective] = useState<ActionCorrective | null>(null);
    const [actionsCorrectives, setActionsCorrectives] = useState<ActionCorrective[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadActionsCorrectives();
    }, []);

    /**
     * Load all actions correctives from the api
     */
    const loadActionsCorrectives = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await actionCorrectiveService.getAllActionCorrectives();
            setActionsCorrectives(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load a single action corrective from the api
     * @param id
     */
    const loadActionCorrective = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await actionCorrectiveService.getActionCorrective(id);
            setActionCorrective(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Make the link between the view and the api to create an action corrective.
     * Also updates the related incident status to 'en_cours' via a PostgreSQL transaction.
     * @param description
     * @param id_responsable
     * @param date_mise_en_place
     * @param statut
     * @param id_incident
     */
    const createActionCorrective = async (
        description: string,
        id_responsable: string,
        date_mise_en_place: string,
        statut: string,
        id_incident: number
    ) => {
        try {
            setLoading(true);
            setError(null);
            return await actionCorrectiveService.createActionCorrective(
                description,
                id_responsable,
                date_mise_en_place,
                statut,
                id_incident
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Make the link between the view and the api to update an action corrective.
     * Also manages incident statuses atomically via a PostgreSQL transaction.
     * @param id
     * @param description
     * @param id_responsable
     * @param statut
     * @param id_incident
     * @param date_mise_en_place
     */
    const updateActionCorrective = async (
        id: number,
        description: string,
        id_responsable: string,
        statut: string,
        id_incident: number,
        date_mise_en_place: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const data = await actionCorrectiveService.updateActionCorrective(
                id,
                description,
                id_responsable,
                statut,
                id_incident,
                date_mise_en_place
            );
            if (data) {
                setActionsCorrectives(prev => prev.map(a => a.id_action === id ? data : a));
            }
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Make the link between the view and the api to delete an action corrective
     * @param id
     */
    const deleteActionCorrective = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await actionCorrectiveService.deleteActionCorrective(id);
            setActionsCorrectives(prev => prev.filter(a => a.id_action !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        actionCorrective,
        actionsCorrectives,
        loading,
        error,
        loadActionsCorrectives,
        loadActionCorrective,
        createActionCorrective,
        updateActionCorrective,
        deleteActionCorrective,
    };
}
