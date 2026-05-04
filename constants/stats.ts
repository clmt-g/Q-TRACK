/**
 * In this file we have constants related to stats
 */
import {colors} from "@/styles/theme";

export const STATUT_INCIDENT_COLORS: Record<string, string> = {
    ouvert: colors.error,
    en_cours: colors.warning,
    cloture: colors.success,
};

export const STATUT_ACTION_COLORS: Record<string, string> = {
    prevue: colors.primary,
    en_cours: colors.warning,
    terminee: colors.success,
};

export const STATUT_LABELS: Record<string, string> = {
    ouvert: 'Ouvert',
    en_cours: 'En cours',
    cloture: 'Clôturé',
    prevue: 'Prévue',
    terminee: 'Terminée',
};