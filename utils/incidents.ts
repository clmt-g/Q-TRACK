/**
 * In this file we have functions related to incidents
 */

/**
 * Get the style of the badge according to the statut of the incident
 * @param statut
 */
export const getStatutStyle = (statut: string) => {
    switch (statut) {
        case 'declare':  return { badge: { backgroundColor: '#1E3A8A', borderColor: '#60A5FA' }, color: '#60A5FA', label: 'Déclaré',  icon: 'alert-circle' };
        case 'en_cours': return { badge: { backgroundColor: '#78350F', borderColor: '#F59E0B' }, color: '#F59E0B', label: 'En cours', icon: 'time' };
        case 'cloture':  return { badge: { backgroundColor: '#065F46', borderColor: '#10B981' }, color: '#10B981', label: 'Clôturé',  icon: 'checkmark-circle' };
        default:         return { badge: { backgroundColor: '#1E3A8A', borderColor: '#60A5FA' }, color: '#60A5FA', label: statut,     icon: 'help-circle' };
    }
};

