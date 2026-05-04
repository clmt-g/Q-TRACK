/**
 * In this file we have scripts related to date formatting dates
 */

/**
 * Format a date string to a more readable format (dd/mm/yyyy hh:mm).
 * @param dateString
 */
export const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
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