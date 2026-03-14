import { supabase, supabaseUrl, supabaseAnonKey } from '@/utils/supabase';
import {error} from "@expo/fingerprint/cli/build/utils/log";

export interface TypeIncident {
    id_type_incident: number;
    libelle: string;
    description: string | null;
    actif: boolean;
    created_at: string;
    deleted_at: string | null;
}

/**
 * The service which interact with the API for the type_incidents table
 */
class TypeIncidentService {

    /**
     * Return all types of incidents
     */
    async getAllTypesIncidents(): Promise<TypeIncident[]> {
        const { data, error } = await supabase
            .from('types_incidents')
            .select('*')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching type incidents', error);
            return [];
        }

        return data || [];
    }

    /**
     * Create a type of incident
     * @param libelle
     * @param description
     * @param actif
     */
    async createTypeIncident(libelle: string, description: string, actif: boolean): Promise<TypeIncident | null> {
        const { data, error } = await supabase
        .from('types_incidents')
            .insert({
                libelle: libelle,
                description: description || null,
                actif: actif,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating type incident', error);
            return null;
        }

        return data;
    }

    /**
     * Update a type of incident
     * @param id
     * @param libelle
     * @param description
     * @param actif
     */
    async upadteTypeIncident(id: number, libelle: string, description: string, actif: boolean): Promise<TypeIncident | null> {
        const { data, error } = await supabase
            .from('types_incidents')
            .update({
                libelle: libelle,
                description: description || null,
                actif: actif,
            })
            .eq('id_type_incident', id)
            .is('deleted_at', null)
            .select()
            .single();

        if (error) {
            console.error('Error updating type incident', error);
            return null;
        }

        return data;
    }

    /**
     * Delete a type of incident
     * @param id
     */
    async deleteTypeIncident(id: number): Promise<void> {
        const { data, error } = await supabase
            .from('types_incidents')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id_type_incident', id)
            .select()
            .single();

        if(error) {
            console.error('Error deleting profile:', error);
            throw new Error(error.message);
        }
    }

}

export const typeIncidentService = new TypeIncidentService();
