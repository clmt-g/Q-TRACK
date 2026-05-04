/**
 * In this file we have scripts related to actions correctives
 */

/**
 * Returns the configuration for a given status, including badge style, color, label, and icon.
 * @param statut
 */
export const getStatutConfig = (statut: string) => {
    switch (statut) {
        case 'prevue':
            return { badge: { backgroundColor: '#1E3A8A', borderColor: '#60A5FA' }, color: '#60A5FA', label: 'Prévue',   icon: 'calendar' };
        case 'en_cours':
            return { badge: { backgroundColor: '#78350F', borderColor: '#F59E0B' }, color: '#F59E0B', label: 'En cours', icon: 'time' };
        case 'terminee':
            return { badge: { backgroundColor: '#065F46', borderColor: '#10B981' }, color: '#10B981', label: 'Terminée', icon: 'checkmark-circle' };
        default:
            return { badge: { backgroundColor: '#1E3A8A', borderColor: '#60A5FA' }, color: '#60A5FA', label: statut,     icon: 'help-circle' };
    }
};

/**
 * Formats a date string to a more readable format (dd/mm/yyyy).
 * @param dateString
 */
export const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non renseignée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};
