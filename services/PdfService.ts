/**
 * In this file we have to code used for the download an incident report to PDF
 */

import {supabase} from "@/utils/supabase";
import {Incident} from "@/services/IncidentService";
import {ActionCorrective} from "@/services/ActionCorrectiveService";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

class PdfService {

    /**
     * Retrieves the incident according to its id
     * @param id_incident
     */
    async getIncident(id_incident: number): Promise<Incident & { profile: { nom: string; prenom: string } }> {
        if (!id_incident) throw new Error('Incident id not found');

        const { data, error } = await supabase
            .from('incidents')
            .select('*, types_incidents(libelle)')
            .eq('id_incident', id_incident)
            .is('deleted_at', null)
            .maybeSingle();

        if (error) throw new Error(`Error while fetching incident: ${error.message}`);
        if (!data) throw new Error('Incident introuvable');

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('nom, prenom')
            .eq('id', data.id_user)
            .single();

        if (profileError) throw new Error(`Error while fetching profile: ${profileError.message}`);
        if(!profile) throw new Error('l\'utilisateur qui a déclaré l\'incident est introuvable');

        return { ...data, profile: profile || null };
    }

    /**
     * Retrieves all the actions correctives related to an incident
     * @param id_incident
     */
    async getRelatedActionCorrectives(id_incident: number) : Promise<ActionCorrective[]> {
        if (!id_incident) throw new Error('Incident id not found');

        const { data, error } = await supabase
            .from('actions_correctives')
            .select('*, profiles(nom, prenom)')
            .eq('id_incident', id_incident)
            .is('deleted_at', null);

        if (error) throw new Error(`Error while retrieving actions: ${error.message}`);

        return data ?? [];
    }

    /**
     * Génère le HTML du rapport
     */
    private generateHTML(incident: any, actions: any[]): string {
        const formatDate = (date: string | null) =>
            date ? new Date(date).toLocaleDateString('fr-FR') : '—';

        // Couleurs principales par statut incident
        const statutColor: Record<string, string> = {
            'déclaré': '#F59E0B',
            'en_cours': '#60A5FA',
            'clôturé': '#10B981',
        };

        // Couleurs principales par statut action
        const statutActionColor: Record<string, string> = {
            'prévue': '#F59E0B',
            'en_cours': '#60A5FA',
            'terminée': '#10B981',
        };

        // Couleurs de fond rgba par statut incident
        const statutBg: Record<string, string> = {
            'déclaré': 'rgba(245, 158, 11, 0.13)',
            'en_cours': 'rgba(96, 165, 250, 0.13)',
            'clôturé': 'rgba(16, 185, 129, 0.13)',
        };

        // Couleurs de fond rgba par statut action
        const statutActionBg: Record<string, string> = {
            'prévue': 'rgba(245, 158, 11, 0.13)',
            'en_cours': 'rgba(96, 165, 250, 0.13)',
            'terminée': 'rgba(16, 185, 129, 0.13)',
        };

        const actionsHTML = actions.length === 0
            ? `<p style="color: #9CA3AF; font-style: italic;">Aucune action corrective associée</p>`
            : actions.map(action => `
                <div style="background: #1E2347; border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left-width: 4px; border-left-style: solid; border-left-color: ${statutActionColor[action.statut] ?? '#60A5FA'};">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #9CA3AF; font-size: 12px;">#${action.id_action}</span>
                        <span style="background: ${statutActionBg[action.statut] ?? 'rgba(96, 165, 250, 0.13)'}; color: ${statutActionColor[action.statut] ?? '#60A5FA'}; padding: 2px 10px; border-radius: 20px; font-size: 12px;">${action.statut}</span>
                    </div>
                    <p style="color: #F1F5F9; margin: 0 0 12px 0;">${action.description}</p>
                    <div style="display: flex; flex-wrap: wrap;">
                        <div style="width: 50%;">
                            <span style="color: #9CA3AF; font-size: 12px;">Responsable</span>
                            <p style="color: #F1F5F9; margin: 2px 0; font-size: 13px;">${action.profiles?.nom} ${action.profiles?.prenom}</p>
                        </div>
                        <div style="width: 50%;">
                            <span style="color: #9CA3AF; font-size: 12px;">Mise en place prévue</span>
                            <p style="color: #F1F5F9; margin: 2px 0; font-size: 13px;">${formatDate(action.date_mise_en_place)}</p>
                        </div>
                    </div>
                </div>
            `).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; background: #131837; color: #F1F5F9; padding: 32px; }
            </style>
        </head>
        <body>
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 16px; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #1E2347;">
                <div>
                    <h1 style="color: #00D9FF; font-size: 24px;">Q-Track</h1>
                    <p style="color: #9CA3AF; font-size: 13px;">Rapport d'incident</p>
                </div>
                <div style="text-align: right;">
                    <p style="color: #9CA3AF; font-size: 12px;">Généré le</p>
                    <p style="color: #F1F5F9; font-size: 13px;">${formatDate(new Date().toISOString())}</p>
                </div>
            </div>

            <!-- Incident -->
            <div style="background: #1E2347; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left-width: 4px; border-left-style: solid; border-left-color: ${statutColor[incident.statut] ?? '#00D9FF'};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <div>
                        <span style="color: #9CA3AF; font-size: 12px;">Incident</span>
                        <h2 style="color: #F1F5F9; font-size: 20px;">#${incident.id_incident}</h2>
                    </div>
                    <span style="background: ${statutBg[incident.statut] ?? 'rgba(0, 217, 255, 0.13)'}; color: ${statutColor[incident.statut] ?? '#00D9FF'}; padding: 4px 14px; border-radius: 20px; font-size: 13px;">${incident.statut}</span>
                </div>

                <div style="display: flex; flex-wrap: wrap; margin-bottom: 16px;">
                    <div style="width: 50%; margin-bottom: 12px;">
                        <span style="color: #9CA3AF; font-size: 12px;">Type</span>
                        <p style="color: #F1F5F9; margin-top: 2px;">${incident.types_incidents?.libelle ?? '—'}</p>
                    </div>
                    <div style="width: 50%; margin-bottom: 12px;">
                        <span style="color: #9CA3AF; font-size: 12px;">Déclaré le</span>
                        <p style="color: #F1F5F9; margin-top: 2px;">${formatDate(incident.date_declaration)}</p>
                    </div>
                    <div style="width: 50%;">
                        <span style="color: #9CA3AF; font-size: 12px;">Déclaré par</span>
                        <p style="color: #F1F5F9; margin-top: 2px;">${incident.profile?.nom} ${incident.profile?.prenom}</p>
                    </div>
                </div>

                <div>
                    <span style="color: #9CA3AF; font-size: 12px;">Description</span>
                    <p style="color: #F1F5F9; margin-top: 4px; line-height: 1.5;">${incident.description}</p>
                </div>
            </div>

            <!-- Actions correctives -->
            <div>
                <h3 style="color: #F1F5F9; font-size: 16px; margin-bottom: 16px;">
                    Actions correctives
                    <span style="color: #9CA3AF; font-size: 13px; font-weight: normal;"> (${actions.length})</span>
                </h3>
                ${actionsHTML}
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Génère et télécharge le rapport PDF
     */
    async generateReport(id_incident: number): Promise<void> {
        const [incident, actions] = await Promise.all([
            this.getIncident(id_incident),
            this.getRelatedActionCorrectives(id_incident),
        ]);

        const html = this.generateHTML(incident, actions);

        const { uri } = await Print.printToFileAsync({
            html,
            base64: false,
        });

        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: `Rapport incident #${id_incident}`,
            UTI: 'com.adobe.pdf',
        });
    }
}

export const pdfService = new PdfService();
