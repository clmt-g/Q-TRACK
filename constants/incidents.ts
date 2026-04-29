/**
 * In this file we have constants related to incidents
 */

/**
 * The different statuts of an incident with their label, color and icon
 */
export const STATUTS = [
    { value: 'declare',  label: 'Déclaré',  color: '#60A5FA', icon: 'alert-circle' },
    { value: 'en_cours', label: 'En cours', color: '#F59E0B', icon: 'time' },
    { value: 'cloture',  label: 'Clôturé',  color: '#10B981', icon: 'checkmark-circle' },
] as const;