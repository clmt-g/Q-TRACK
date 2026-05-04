/**
 * In this file we have constants related to actions correctives
 */

/**
 * List of possible statuses for corrective actions, each with its corresponding label, color, and icon.
 */
export const STATUTS = [
    { value: 'prevue',   label: 'Prévue',   color: '#60A5FA', icon: 'calendar' },
    { value: 'en_cours', label: 'En cours', color: '#F59E0B', icon: 'time' },
    { value: 'terminee', label: 'Terminée', color: '#10B981', icon: 'checkmark-circle' },
] as const;
