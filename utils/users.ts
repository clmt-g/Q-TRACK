/**
 * In this file we have scripts related users
 */

/**
 * Get the configuration for a given user role, including icon, color, and gradient.
 * @param role
 */
export const getRoleConfig = (role: string) => {
    const configs: Record<string, { icon: any; color: string; gradient: string[] }> = {
        operateur: {
            icon: 'construct',
            color: '#3b82f6',
            gradient: ['#3b82f6', '#2563eb']
        },
        qualite: {
            icon: 'checkmark-circle',
            color: '#10b981',
            gradient: ['#10b981', '#059669']
        },
        admin: {
            icon: 'settings',
            color: '#8b5cf6',
            gradient: ['#8b5cf6', '#7c3aed']
        },
        direction: {
            icon: 'briefcase',
            color: '#f59e0b',
            gradient: ['#f59e0b', '#d97706']
        }
    };
    return configs[role] || configs.operateur;
};

export const getRoleBadgeStyle = (role: string) => {
    switch (role) {
        case 'admin':
            return { backgroundColor: '#92400E', borderColor: '#F59E0B' };
        case 'direction':
            return { backgroundColor: '#7C2D12', borderColor: '#F97316' };
        case 'qualite':
            return { backgroundColor: '#065F46', borderColor: '#10B981' };
        case 'operateur':
        default:
            return { backgroundColor: '#1E3A8A', borderColor: '#60A5FA' };
    }
};

export const getRoleLabel = (role: string) => {
    switch (role) {
        case 'admin':
            return 'Administrateur';
        case 'direction':
            return 'Direction';
        case 'qualite':
            return 'Qualité';
        case 'operateur':
            return 'Opérateur';
        default:
            return role;
    }
};

export const getRoleIcon = (role: string) => {
    switch (role) {
        case 'admin':
            return 'shield-checkmark';
        case 'direction':
            return 'business';
        case 'qualite':
            return 'checkmark-circle';
        case 'operateur':
            return 'person';
        default:
            return 'person';
    }
};