import { supabase } from "@/utils/supabase";

export interface ActionCorrective {
    id_action: number;
    description: string;
    id_responsable: string;
    date_mise_en_place: string | null;
    statut: string;
    id_incident: number;
    created_at: string;
    deleted_at: string | null;
    profiles: {
        nom: string;
        prenom: string;
    } | null;
    incidents: {
        description: string;
        statut: string;
        types_incidents: {
            libelle: string;
        } | null;
    } | null;
}

/**
 * The service which interact with the database for the actions_correctives table
 */
class ActionCorrectiveService {

    /**
     * Return all actions correctives
     */
    async getAllActionCorrectives(): Promise<ActionCorrective[]> {
        const { data, error } = await supabase
            .from('actions_correctives')
            .select('*, profiles(nom, prenom), incidents(statut, types_incidents(libelle))')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`An error occurred while fetching the actions correctives: ${error.message}`);
        }

        return data;
    }

    /**
     * Return the action corrective according to the key id
     * @param id
     */
    async getActionCorrective(id: number): Promise<ActionCorrective> {
        const { data, error } = await supabase
            .from('actions_correctives')
            .select('*, profiles(nom, prenom), incidents(description, statut, types_incidents(libelle))')
            .eq('id_action', id)
            .is('deleted_at', null)
            .maybeSingle();

        if (error) {
            throw new Error(`An error occurred while fetching the actions: ${error.message}`);
        }

        return data;
    }

    /**
     * Create an action corrective and atomically update the related incident status.
     * Uses a PostgreSQL function (create_action_corrective) to ensure both operations
     * are executed in a single transaction — if one fails, both are rolled back.
     * The incident status is set to 'en_cours' only if it was previously 'declare'.
     * @param description
     * @param id_responsable
     * @param date_mise_en_place
     * @param statut
     * @param id_incident
     */
    async createActionCorrective(
        description: string,
        id_responsable: string,
        date_mise_en_place: string,
        statut: string,
        id_incident: number
    ): Promise<ActionCorrective> {
        const { data, error } = await supabase.rpc('create_action_corrective', {
            p_description: description,
            p_id_responsable: id_responsable,
            p_date_mise_en_place: date_mise_en_place,
            p_statut: statut,
            p_id_incident: id_incident,
        });

        if (error) {
            throw new Error(`An error occurred while creating action corrective: ${error.message}`);
        }

        return data;
    }

    /**
     * Update an action corrective and atomically manage incident statuses.
     * Uses a PostgreSQL function (update_action_corrective) to ensure all operations
     * are executed in a single transaction — if one fails, all are rolled back.
     * If the incident changes, the new incident is set to 'en_cours' (if 'declare'),
     * and the old incident is reverted to 'declare' if it has no remaining active actions.
     * @param id
     * @param description
     * @param id_responsable
     * @param statut
     * @param id_incident
     * @param date_mise_en_place
     */
    async updateActionCorrective(
        id: number,
        description: string,
        id_responsable: string,
        statut: string,
        id_incident: number,
        date_mise_en_place: string
    ): Promise<ActionCorrective> {
        const { data, error } = await supabase.rpc('update_action_corrective', {
            p_id: id,
            p_description: description,
            p_id_responsable: id_responsable,
            p_statut: statut,
            p_id_incident: id_incident,
            p_date_mise_en_place: date_mise_en_place,
        });

        if (error) {
            throw new Error(`Error occured while updating action corrective: ${error.message}`);
        }

        return data;
    }

    async deleteActionCorrective(id: number): Promise<void> {
        const { error } = await supabase
            .from('actions_correctives')
            .update({
                deleted_at: new Date().toISOString()
            })
            .eq('id_action', id);

        if (error) {
            throw new Error(`Error while deleting the action corrective: ${error.message}`);
        }
    }
}

export const actionCorrectiveService = new ActionCorrectiveService();
