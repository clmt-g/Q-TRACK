import { supabase, supabaseUrl, supabaseAnonKey } from '@/utils/supabase';

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


}

export const typeIncidentService = new TypeIncidentService();
