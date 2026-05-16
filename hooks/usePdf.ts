import { useState } from 'react';
import { pdfService } from '@/services/PdfService';

export function usePdf() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateReport = async (id_incident: number) => {
        try {
            setLoading(true);
            setError(null);
            await pdfService.generateReport(id_incident);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { generateReport, loading, error };
}
