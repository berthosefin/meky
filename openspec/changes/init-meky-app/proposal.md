## Why

L'utilisateur doit mémoriser de nombreux codes USSD (MVola, Orange Money, Airtel Money...) avec leurs variables (numéro, montant). Aujourd'hui il les tape à la main à chaque opération. L'app **meky** est un carnet hors-ligne qui stocke ces codes avec des variables nommées et les exécute en un tap.

## What Changes

- Création de l'application mobile **meky** (Android uniquement), framework Expo + React Native + TypeScript.
- **Page Home** : liste des codes USSD enregistrés, chaque code affiche nom + aperçu du code. Tap sur un code → page Exécution. Bouton `+` → page Ajout.
- **Page Ajout** : formulaire de création d'un code (nom, code USSD avec variables `{NOM}`), détection automatique des variables, bouton sauvegarder.
- **Page Exécution** : inputs pour chaque variable (clavier adapté selon type), aperçu du code substitué en direct, bouton Exécuter qui ouvre le dialer avec le code USSD encodé (`ACTION_DIAL`).
- **Stockage 100 % hors-ligne** via MMKV : CRUD complet des codes (créer, lire, modifier, supprimer, lister).
- **Modification et suppression** : accessible depuis la page Home (tap long ou bouton d'édition) et depuis la page Exécution.
- Infrastructure : Expo (TypeScript), Expo Router (file-based), NativeWind (styling), MMKV (storage), EAS Build (génération APK), distribution via GitHub Releases.
- Git : repo privé GitHub, commits conventionnels en anglais (commitlint + husky).

## Capabilities

### New Capabilities

- `ussd-code-management`: Enregistrer, lister, modifier et supprimer des codes USSD avec des variables nommées `{NOM}`, stockés hors-ligne.
- `ussd-code-execution`: Remplir les variables d'un code USSD, prévisualiser le code substitué et l'envoyer au dialer Android via un URI `tel:` encodé.

### Modified Capabilities

_Aucune (nouveau projet, aucune spec existante)._

## Impact

- **Nouveau projet** : aucune codebase existante à modifier.
- **Dépendances** : Expo, expo-router, NativeWind, react-native-mmkv, TypeScript ; tooling commitlint/husky, EAS CLI.
- **Plates-formes** : Android uniquement (iOS limité pour le USSD, hors scope du MVP).
- **Distribution** : APK via EAS Build, publié en GitHub Releases sur le repo privé.