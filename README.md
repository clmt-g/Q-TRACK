# Q-Track — Guide de démarrage

Application mobile Android de gestion qualité, développée avec Expo / React Native et Supabase.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) installé sur ton téléphone Android
- Un compte [Supabase](https://supabase.com/) avec un projet configuré
- [ngrok](https://ngrok.com/) installé sur ta machine (pour le tunnel)

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd q-track
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Supabase

Le fichier `utils/supabase.ts` est ignoré par git (`.gitignore`) et doit être recréé manuellement. Crée le fichier `utils/supabase.ts` avec le contenu suivant :

```ts
import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://ton-projet.supabase.co';
export const supabaseAnonKey = 'ta-clé-anon';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
```

> Les valeurs `supabaseUrl` et `supabaseAnonKey` se trouvent dans ton dashboard Supabase : **Project Settings → API**

### 4. Configurer les variables d'environnement

Crée un fichier `.env` à la racine du projet :

```env
# Dev — permet de bypasser la session de reset password en développement
# Mettre à false uniquement pour tester le flow complet depuis un email
EXPO_PUBLIC_DEV_SKIP_SESSION=true
```

---

## Lancer le serveur de développement

### Avec le tunnel ngrok (recommandé pour tester sur téléphone physique)

```bash
npx expo start --tunnel
```

Scanne ensuite le QR code avec **Expo Go** sur ton téléphone.

> Le tunnel ngrok permet d'accéder au serveur depuis n'importe quel réseau, sans être sur le même Wi-Fi que ta machine.

---

## Configuration Supabase

Dans le dashboard Supabase de ton projet, sous **Authentication → URL Configuration** :

**Site URL :**
```
qtrack://
```

**Redirect URLs (toutes les ajouter) :**
```
qtrack://**
exp://192.168.*.*:8081/**
exp://*.exp.direct/**
```

> Le `**` est important — il accepte n'importe quel path après le scheme.

---

## Build APK (production)

Le projet utilise EAS Build. Assure-toi d'avoir le CLI EAS installé :

```bash
npm install -g eas-cli
eas login
```

Puis pour builder l'APK :

```bash
eas build --platform android --profile preview
```

---

## Structure du projet

```
app/                  # Pages (expo-router)
  (tabs)/             # Navigation par onglets
  _layout.tsx         # Layout racine (navigation, providers)
  login.tsx
  forgot-password.tsx
  reset-password.tsx
components/           # Composants réutilisables
hooks/                # Hooks React personnalisés
services/             # Couche d'accès aux données (Supabase, etc.)
contexts/             # Contextes React (Auth, Impersonation)
styles/               # Thème global et couleurs
utils/                # Utilitaires (client Supabase, etc.)
```

---

## Notes

- Le projet utilise **expo-router** pour la navigation — les fichiers dans `app/` correspondent directement aux routes.
- La base de données et l'authentification sont gérées par **Supabase**.
- Le deep linking est configuré avec le scheme `qtrack://` pour la redirection des emails (reset de mot de passe, etc.).