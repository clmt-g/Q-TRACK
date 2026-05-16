import { supabase } from "@/utils/supabase";
import {Profile} from "@/services/ProfileService";

export interface Incident {
    id_incident: number;
    date_declaration: string;
    description: string;
    statut: string;
    id_user: string;
    id_type_incident: number;
    created_at: string;
    deleted_at: string | null;
    types_incidents: {
        libelle: string;
    } | null;
    profiles: {
        nom: string;
        prenom: string;
    } | null;
}

/**
 * The service which interact with the database for the incidents table
 */
class IncidentService {

    /**
     * Return all incidents
     */
    async getAllIncidents(): Promise<Incident[]> {
        const { data, error } = await supabase
            .from('incidents')
            .select('*, types_incidents(libelle)')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Error while fetching incidents: ${error.message}`);
        }

        return data;
    }

    /**
     * Return the incident corresponding to the key id_incident
     * @param id_incident
     */
    async getIncident(id_incident: number): Promise<Incident & Profile> {
        if (!id_incident) {
            throw new Error('Incident id not found');
        }

        const { data, error } = await supabase
            .from('incidents')
            .select('*, types_incidents(libelle)')
            .eq('id_incident', id_incident)
            .is('deleted_at', null)
            .maybeSingle();

        if (error) {
            throw new Error(`Error while fetching incident: ${error.message}`);
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('nom, prenom')
            .eq('id', data.id_user)
            .single();

        return { ...data, profiles: profile };
    }

    /**
     * Create an incident
     * @param description
     * @param statut
     * @param id_user
     * @param id_type_incident
     */
    async createIncident(description: string, statut: string, id_user: string, id_type_incident: number): Promise<Incident> {
        if (!id_user) {
            throw new Error('Utilisateur non connecté');
        }

        const { data, error } = await supabase
            .from('incidents')
            .insert({
                date_declaration: new Date().toISOString(),
                description: description,
                statut: statut,
                id_user: id_user,
                id_type_incident: id_type_incident,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Error while creating the incident: ${error.message}`);
        }

        return data;
    }

    /**
     * Update an incident according to the key id_incident provided
     * @param id_incident
     * @param description
     * @param statut
     * @param id_type_incident
     */
    async updateIncident(id_incident: number, description: string, statut: string, id_type_incident: number): Promise<Incident> {
        if (!id_incident) {
            throw new Error('Incident id not found');
        }

        const { data, error } = await supabase
            .from('incidents')
            .update({
                description: description,
                statut: statut,
                id_type_incident: id_type_incident,
            })
            .eq('id_incident', id_incident)
            .is('deleted_at', null)
            .select()
            .maybeSingle();

        if (error) {
            throw new Error(`Error while updating incidents: ${error.message}`);;
        }
        if (!data) throw new Error('Incident introuvable ou accès refusé');

        return data;
    }

    /**
     * Soft delete an incident according to the key id_incident provided
     * @param id_incident
     */
    async deleteIncident(id_incident: number): Promise<void> {
        if (!id_incident) {
            throw new Error('Incident id not found');
        }

        const { error } = await supabase
            .from('incidents')
            .update({
                deleted_at: new Date().toISOString()
            })
            .eq('id_incident', id_incident);

        if (error) {
            throw new Error(`Error while deleting incidents: ${error.message}`);
        }
    }
}

export const incidentService = new IncidentService();
