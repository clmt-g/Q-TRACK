/**
 * In this file we have scripts related to statistics
 */

import {supabase} from "@/utils/supabase";

export interface Stats {
    incidentCoverage: number;
    incidentStatutRate: Record<string, number>;
    actionCorrectiveStatutRate: Record<string, number>;
    averageIncidentsPerMonth: number;
    averageActionsCorrectivesPerMonth: number;
    averageIncidentsPerYear: number;
    averageActionsCorrectivesPerYear: number;
    averageIncidentsPerUser: number;
    averageActionsCorrectivesPerUser: number;
    incidentsAverageByType: Record<string, number>;
}

class StatsService {

    /**
     * Returns the percentage of incidents that have been covered
     * That is to say the percentage that have actions corrective
     * @return number - the percentage of incidents that have been covered
     */
    async getIncidentCoverage(): Promise<number> {
        // fetching all the incidents
        const {data: dataIncident, error: errorIncident} = await supabase
            .from('incidents')
            .select('*')
            .is('deleted_at', null);

        // fetching all the actions correctives
        const {data: dataActionCorrective, error: errorActionCorrective} = await supabase
            .from('actions_correctives')
            .select('*')
            .is('deleted_at', null);

        // error handling
        if (errorIncident) {
            throw new Error(`Error while fetching the incidents: ${errorIncident.message}`);
        }
        if (errorActionCorrective) {
            throw new Error(`Error while fetching the actions correctives: ${errorActionCorrective.message}`);
        }

        // calculating the percentage
        let coveredIncidents = Number();

        dataIncident?.forEach((incident) => {
            const isCovered = dataActionCorrective?.some(
                (corrective) => corrective.id_incident === incident.id_incident
            );
            if (isCovered) coveredIncidents++;
        });

        return (coveredIncidents / (dataIncident?.length || 1)) * 100;
    }

    /**
     * Returns the percentage of incidents by status
     * @return Record<string, number> - the percentage of incidents by status
     */
    async getIncidentStatutRate(): Promise<Record<string, number>> {
        // fetching all the incidents
        const {data, error} = await supabase
            .from('incidents')
            .select('statut')
            .is('deleted_at', null);

        // error handling
        if (error) {
            throw new Error(`Error while fetching the incidents: ${error.message}`);
        }

        // reparting the incidents by status
        const statutCount: Record<string, number> = {};
        data?.forEach((incident) => {
            if (statutCount[incident.statut]) {
                statutCount[incident.statut]++;
            } else {
                statutCount[incident.statut] = 1;
            }
        });

        // calculating the percentage for each status
        const totalIncidents = data?.length || 1;
        const statutRate: Record<string, number> = {};
        for (const statut in statutCount) {
            statutRate[statut] = (statutCount[statut] / totalIncidents) * 100;
        }

        return statutRate;
    }

    /**
     * Returns the percentage of actions correctives by status
     * @return Record<string, number> - the percentage of actions correctives by status
     */
    async getActionCorrectiveStatutRate(): Promise<Record<string, number>> {
        // fetching all the actions correctives
        const {data, error} = await supabase
            .from('actions_correctives')
            .select('statut')
            .is('deleted_at', null);

        // error handling
        if (error) {
            throw new Error(`Error while fetching the actions correctives: ${error.message}`);
        }

        // reparting the actions correctives by status
        const statutCount: Record<string, number> = {};
        data?.forEach((action) => {
            if (statutCount[action.statut]) {
                statutCount[action.statut]++;
            } else {
                statutCount[action.statut] = 1;
            }
        });

        // calculating the percentage for each status
        const totalActions = data?.length || 1;
        const statutRate: Record<string, number> = {};
        for (const statut in statutCount) {
            statutRate[statut] = (statutCount[statut] / totalActions) * 100;
        }

        return statutRate;
    }

    /**
     * Returns the average number of incidents per month
     * @return number - the average number of incidents per month
     */
    async getAverageIncidentsPerMonth(): Promise<number> {
        // fetching all the incidents
        const {data, error} = await supabase
            .from('incidents')
            .select('created_at')
            .is('deleted_at', null);

        // error handling
        if (error) {
            throw new Error(`Error while fetching the incidents: ${error.message}`);
        }

        // counting the number of incidents per month
        const incidentsPerMonth: Record<string, number> = {};
        data?.forEach((incident) => {
            const month = new Date(incident.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (incidentsPerMonth[month]) {
                incidentsPerMonth[month]++;
            } else {
                incidentsPerMonth[month] = 1;
            }
        });

        // calculating the average number of incidents per month
        const totalMonths = Object.keys(incidentsPerMonth).length || 1;
        const totalIncidents = data?.length || 0;
        return totalIncidents / totalMonths;
    }

    /**
     * Returns the average number of actions correctives per month
     * @return number - the average number of actions correctives per month
     */
    async getAverageActionsCorrectivesPerMonth(): Promise<number> {
        // fetching all the actions correctives
        const {data, error} = await supabase
            .from('actions_correctives')
            .select('created_at')
            .is('deleted_at', null);

        // error handling
        if (error) {
            throw new Error(`Error while fetching the actions correctives: ${error.message}`);
        }

        // counting the number of actions correctives per month
        const actionsPerMonth: Record<string, number> = {};
        data?.forEach((action) => {
            const month = new Date(action.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (actionsPerMonth[month]) {
                actionsPerMonth[month]++;
            } else {
                actionsPerMonth[month] = 1;
            }
        });

        // calculating the average number of actions correctives per month
        const totalMonths = Object.keys(actionsPerMonth).length || 1;
        const totalActions = data?.length || 0;
        return totalActions / totalMonths;
    }

    /**
     * Returns the average number of actions correctives per year
     * @return number - the average number of actions correctives per year
     */
    async getAverageActionsCorrectivesPerYear(): Promise<number> {
        // fetching all the actions correctives
        const {data, error} = await supabase
            .from('actions_correctives')
            .select('created_at')
            .is('deleted_at', null);

        // error handling
        if (error) {
            throw new Error(`Error while fetching the actions correctives: ${error.message}`);
        }

        // counting the number of actions correctives per year
        const actionsPerYear: Record<string, number> = {};
        data?.forEach((action) => {
            const year = new Date(action.created_at).getFullYear().toString();
            if (actionsPerYear[year]) {
                actionsPerYear[year]++;
            } else {
                actionsPerYear[year] = 1;
            }
        });

        // calculating the average number of actions correctives per year
        const totalYears = Object.keys(actionsPerYear).length || 1;
        const totalActions = data?.length || 0;
        return totalActions / totalYears;
    }

    /**
     * Returns the average number of incidents per year
     * @return number - the average number of incidents per year
     */
    async getAverageIncidentsPerYear(): Promise<number> {
        // fetching all the incidents
        const {data, error} = await supabase
            .from('incidents')
            .select('created_at')
            .is('deleted_at', null);

        // error handling
        if (error) {
            throw new Error(`Error while fetching the incidents: ${error.message}`);
        }

        // counting the number of incidents per year
        const incidentsPerYear: Record<string, number> = {};
        data?.forEach((incident) => {
            const year = new Date(incident.created_at).getFullYear().toString();
            if (incidentsPerYear[year]) {
                incidentsPerYear[year]++;
            } else {
                incidentsPerYear[year] = 1;
            }
        });

        // calculating the average number of incidents per year
        const totalYears = Object.keys(incidentsPerYear).length || 1;
        const totalIncidents = data?.length || 0;
        return totalIncidents / totalYears;
    }

    /**
     * Returns the average number of incidents per user
     * @return number - the average number of incidents per user
     */
    async getAverageIncidentsPerUser() : Promise<number> {
        // fetching all the incidents
        const {data, error} = await supabase
            .from('incidents')
            .select('created_at, id_user')
            .is('deleted_at', null);

        // error handling
        if (error) {
            throw new Error(`Error while fetching the incidents: ${error.message}`);
        }

        // counting the number of incidents per user
        const incidentsPerUser: Record<string, number> = {};
        data?.forEach((incident) => {
            const userId = incident.id_user;
            if (incidentsPerUser[userId]) {
                incidentsPerUser[userId]++;
            } else {
                incidentsPerUser[userId] = 1;
            }
        });

        // calculating the average number of incidents per user
        const totalUsers = Object.keys(incidentsPerUser).length || 1;
        const totalIncidents = data?.length || 0;
        return totalIncidents / totalUsers;
    }

    /**
     * Returns the average number of actions correctives per user
     * @return number - the average number of actions correctives per user
     */
    async getAverageActionsCorrectivesPerUser() : Promise<number> {
        // fetching all the actions correctives
        const {data, error} = await supabase
            .from('actions_correctives')
            .select('created_at, id_responsable')
            .is('deleted_at', null);

        // error handling
        if (error) {
            throw new Error(`Error while fetching the actions correctives: ${error.message}`);
        }

        // counting the number of actions correctives per user
        const actionsPerUser: Record<string, number> = {};
        data?.forEach((action) => {
            const userId = action.id_responsable;
            if (actionsPerUser[userId]) {
                actionsPerUser[userId]++;
            } else {
                actionsPerUser[userId] = 1;
            }
        });

        // calculating the average number of actions correctives per user
        const totalUsers = Object.keys(actionsPerUser).length || 1;
        const totalActions = data?.length || 0;
        return totalActions / totalUsers;
    }

    async getIncidentsAverageByType(): Promise<Record<string, number>> {
        // fetching all the incidents
        const {data: dataIncident, error: errorIncident} = await supabase
            .from('incidents')
            .select('created_at, id_type_incident')
            .is('deleted_at', null);

        // fetching all types
        const {data: dataType, error: errorType} = await supabase
            .from('types_incidents')
            .select('id_type_incident, libelle')
            .is('deleted_at', null);

        // error handling
        if (errorIncident) {
            throw new Error(`Error while fetching the incidents: ${errorIncident.message}`);
        }
        if (errorType) {
            throw new Error(`Error while fetching the types: ${errorType.message}`);
        }

        // counting the number of incidents per type
        const incidentsPerType: Record<string, number> = {};
        dataIncident?.forEach((incident) => {
            const type = dataType?.find((type) => type.id_type_incident === incident.id_type_incident)?.libelle || 'Deleted Type';
            if (incidentsPerType[type]) {
                incidentsPerType[type]++;
            } else {
                incidentsPerType[type] = 1;
            }
        });

        // calculating the average number of incidents per type
        const totalTypes = Object.keys(incidentsPerType).length || 1;
        const averageIncidentsPerType: Record<string, number> = {};
        for (const type in incidentsPerType) {
            averageIncidentsPerType[type] = incidentsPerType[type] / totalTypes;
        }

        return averageIncidentsPerType;
    }

}

export const statsService = new StatsService();
