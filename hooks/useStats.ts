import { useState, useCallback } from "react";
import { statsService, Stats } from "@/services/StatsService";

export type { Stats };

/**
 * Is the link between the API and the views for stats
 */
export function useStats() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                incidentCoverage,
                incidentStatutRate,
                actionCorrectiveStatutRate,
                averageIncidentsPerMonth,
                averageActionsCorrectivesPerMonth,
                averageIncidentsPerYear,
                averageActionsCorrectivesPerYear,
                averageIncidentsPerUser,
                averageActionsCorrectivesPerUser,
                incidentsAverageByType,
            ] = await Promise.all([
                statsService.getIncidentCoverage(),
                statsService.getIncidentStatutRate(),
                statsService.getActionCorrectiveStatutRate(),
                statsService.getAverageIncidentsPerMonth(),
                statsService.getAverageActionsCorrectivesPerMonth(),
                statsService.getAverageIncidentsPerYear(),
                statsService.getAverageActionsCorrectivesPerYear(),
                statsService.getAverageIncidentsPerUser(),
                statsService.getAverageActionsCorrectivesPerUser(),
                statsService.getIncidentsAverageByType(),
            ]);

            setStats({
                incidentCoverage,
                incidentStatutRate,
                actionCorrectiveStatutRate,
                averageIncidentsPerMonth,
                averageActionsCorrectivesPerMonth,
                averageIncidentsPerYear,
                averageActionsCorrectivesPerYear,
                averageIncidentsPerUser,
                averageActionsCorrectivesPerUser,
                incidentsAverageByType,
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    }, []);

    return { stats, loading, error, loadStats };
}