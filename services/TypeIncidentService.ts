import { supabase } from '@/utils/supabase';

export interface TypeIncident {
    id_type_incident: number;
    libelle: string;
    description: string | null;
    actif: boolean;
    created_at: string;
    deleted_at: string | null;
}

/**
 * The service which interact with the database for the type_incidents table
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
            throw new Error(`Error fetching all the types of incidents: ${error.message}` );
        }

        return data;
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
            throw new Error(`Error creating the type of incident: ${error.message}` );
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
    async updateTypeIncident(id: number, libelle: string, description: string, actif: boolean): Promise<TypeIncident | null> {
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
            .maybeSingle();

        if (error) {
            throw new Error(`Error updating the type of incident: ${error.message}` );
        }

        if (!data) throw new Error('Type d\'incident introuvable ou accès refusé');

        return data;
    }

    /**
     * Delete a type of incident
     * @param id
     */
    async deleteTypeIncident(id: number): Promise<void> {
        const { error } = await supabase
            .from('types_incidents')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id_type_incident', id)
            .select()
            .single();

        if(error) {
            throw new Error(`Error deleting the type of incident: ${error.message}` );
        }
    }

}

export const typeIncidentService = new TypeIncidentService();
