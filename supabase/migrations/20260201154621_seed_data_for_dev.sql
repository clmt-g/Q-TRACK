-- ============================================
-- SEED FILE - Q-Track Database
-- ============================================

-- ============================================
-- SEED PROFILES
-- ============================================
-- 1 profil par rôle (4 au total)

INSERT INTO profiles (id, nom, prenom, role)
VALUES
-- Admin
('89000303-868f-4877-a39c-bc5b9ea7624c', 'Administrateur', 'Système', 'admin'),
-- Qualité
('9eae4e71-3eee-4f3f-8a1f-f39416c5bd92', 'Dubois', 'Marie', 'qualite'),
-- Opérateur
('d745a3fe-f742-4f90-876c-311ba5e85d07', 'Martin', 'Pierre', 'operateur'),
-- Direction
('e887f13c-209e-45f8-a912-fae5b7a5a181', 'Dupont', 'Sophie', 'direction');

-- ============================================
-- SEED TYPES INCIDENTS
-- ============================================
-- 5 types d'incidents courants

INSERT INTO types_incidents (libelle, description, actif)
VALUES ('Panne machine', 'Arrêt imprévu d''une machine de production', true),
       ('Défaut qualité', 'Non-conformité détectée sur un produit ou processus', true),
       ('Accident travail', 'Incident lié à la sécurité du personnel', true),
       ('Retard livraison', 'Problème dans la chaîne logistique', true),
       ('Erreur de process', 'Mauvaise application d''une procédure', true);

-- ============================================
-- SEED INCIDENTS
-- ============================================
-- 6 incidents avec différents statuts

INSERT INTO incidents (description, statut, id_user, id_type_incident)
VALUES
-- Incidents déclarés
('Machine de découpe A3 en panne - Courroie principale cassée', 'declare', 'd745a3fe-f742-4f90-876c-311ba5e85d07', 1),
('Produit non conforme détecté sur lot #2024-156', 'declare', '9eae4e71-3eee-4f3f-8a1f-f39416c5bd92', 2),

-- Incidents en cours
('Glissade dans l''atelier B - Zone humide', 'en_cours', 'd745a3fe-f742-4f90-876c-311ba5e85d07', 3),
('Retard de 3 jours du fournisseur XYZ', 'en_cours', '89000303-868f-4877-a39c-bc5b9ea7624c', 4),

-- Incidents clôturés
('Température de cuisson incorrecte - Four 2', 'cloture', 'd745a3fe-f742-4f90-876c-311ba5e85d07', 5),
('Défaut d''étanchéité sur série 450', 'cloture', '9eae4e71-3eee-4f3f-8a1f-f39416c5bd92', 2);

-- ============================================
-- SEED ACTIONS CORRECTIVES
-- ============================================
-- 8 actions liées aux incidents (certains incidents ont plusieurs actions)

INSERT INTO actions_correctives (description, id_responsable, date_mise_en_place, statut, id_incident)
VALUES
-- Actions pour incident 1 (Panne machine A3)
('Remplacer la courroie principale', '89000303-868f-4877-a39c-bc5b9ea7624c', '2026-02-02', 'prevue', 1),
('Vérifier l''alignement des poulies', '9eae4e71-3eee-4f3f-8a1f-f39416c5bd92', NULL, 'prevue', 1),

-- Actions pour incident 2 (Défaut qualité lot #2024-156)
('Isoler le lot non conforme', '9eae4e71-3eee-4f3f-8a1f-f39416c5bd92', '2026-02-01', 'terminee', 2),
('Analyser la cause racine', '9eae4e71-3eee-4f3f-8a1f-f39416c5bd92', '2026-02-03', 'en_cours', 2),

-- Actions pour incident 3 (Glissade atelier B)
('Installer tapis antidérapants', '9eae4e71-3eee-4f3f-8a1f-f39416c5bd92', '2026-02-05', 'en_cours', 3),
('Former le personnel aux risques de chute', '89000303-868f-4877-a39c-bc5b9ea7624c', '2026-02-10', 'prevue', 3),

-- Actions pour incident 5 (Température cuisson incorrecte)
('Recalibrer le thermostat du four 2', '89000303-868f-4877-a39c-bc5b9ea7624c', '2026-01-28', 'terminee', 5),

-- Actions pour incident 6 (Défaut étanchéité)
('Renforcer le contrôle qualité sur cette série', '89000303-868f-4877-a39c-bc5b9ea7624c', '2026-01-25', 'terminee', 6);

