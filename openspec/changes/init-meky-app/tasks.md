## 1. Spike USSD

- [x] 1.1 Test manuel sur l'appareil cible : saisir `*#100#` (ou un code de solde opérateur) dans le dialer et vérifier si la session USSD se lance automatiquement ou exige d'appuyer sur "Appeler"
- [x] 1.2 Tester un URI `tel:` encodé (ex: `tel:%23%2A100%2A%23`) dans un lanceur d'intent et noter le comportement du dialer du testeur
- [x] 1.3 Noter les résultats (modèle + version Android) dans un fichier `docs/ussd-spike.md` pour documenter le comportement constaté

## 2. Fondations du projet

- [x] 2.1 Créer le repo GitHub privé `meky` et le connecter au remote local
- [x] 2.2 Initialiser le projet Expo TypeScript (`npx create-expo-app` avec template typescript)
- [x] 2.3 Ajouter et configurer Expo Router (structure `app/`, `_layout.tsx`)
- [x] 2.4 Ajouter et configurer NativeWind (tailwind.config + babel)
- [x] 2.5 Ajouter `react-native-mmkv`
- [x] 2.6 Configurer commitlint + husky (conventional commits en anglais)
- [ ] 2.7 Commit initial : `chore: init expo project with typescript`

## 3. Modèle de données et couche de stockage

- [x] 3.1 Créer les types TypeScript `UssdCode` (id, name, code, variables, createdAt, updatedAt) et `Variable` (name, type, placeholder)
- [x] 3.2 Implémenter le parser de formule : extraire les variables uniques `{NOM}` d'une formule (regex, dédoublonnage, ordre d'apparition)
- [x] 3.3 Définir le mapping type → clavier (phone/amount/text) et placeholder par défaut
- [x] 3.4 Implémenter la couche storage MMKV : `listCodes`, `getCode`, `saveCode`, `deleteCode`
- [x] 3.5 Écrire les tests unitaires du parser (variables détectées, variables en double, formule sans variable, substitution)

## 4. Page Home (liste des codes)

- [x] 4.1 Créer la route `app/index.tsx` avec une `FlatList` des codes
- [x] 4.2 Créer le composant `Card` (nom + aperçu formule) au style shadcn
- [x] 4.3 Ajouter la navigation : tap sur un code → page Exécution, bouton `+` → page Ajout
- [x] 4.4 Ajouter l'accès à la modification et la suppression (tap long ou bouton dédié) avec dialog de confirmation
- [x] 4.5 Implémenter l'état vide (aucun code enregistré)

## 5. Page Ajout / Édition

- [x] 5.1 Créer la route `app/code/new.tsx` : nom + formule
- [x] 5.2 Afficher l'aperçu dynamique des variables détectées dans la formule (avec type et placeholder)
- [x] 5.3 Valider la sauvegarde (nom requis, formule requise) avec messages d'erreur
- [x] 5.4 Persister le code via la couche storage et retourner à la Home
- [x] 5.5 Réutiliser la même page pour la modification d'un code existant (`app/code/[id]` en mode edit) avec pré-remplissage

## 6. Page Exécution

- [x] 6.1 Créer la route `app/code/[id]` : charger le code, afficher un champ par variable avec clavier adapté
- [x] 6.2 Afficher l'aperçu en direct de la formule substituée (variables vides conservées en `{NOM}`)
- [x] 6.3 Bloquer l'exécution tant qu'une variable obligatoire est vide, signaler la variable manquante
- [x] 6.4 Implémenter l'encodeur USSD (`#` → `%23`, `*` → `%2A`) en fonction pure et le tester
- [x] 6.5 Implémenter le lancement : `Linking.canOpenURL` puis `openURL('tel:' + encoded)`, gestion de l'erreur "aucun dialer"
- [x] 6.6 Ajouter l'accès à l'édition et à la suppression depuis la page Exécution

## 7. UI & Polish

- [x] 7.1 Créer le fichier de thème (couleurs, espacements, radius) et appliquer sur les composants
- [x] 7.2 Prendre en charge le thème clair/sombre selon la préférence système
- [x] 7.3 Ajouter les icônes (ajout, édition, suppression) pour les actions
- [x] 7.4 Vérifier le comportement au clavier ouvert (inputs visibles, pas de chevauchement)

## 8. Build et distribution

- [x] 8.1 Configurer EAS Build (`eas.json` avec profile `preview`)
- [ ] 8.2 Générer l'APK (`eas build --platform android --profile preview`)
- [ ] 8.3 Publier l'APK en GitHub Release sur le repo privé
- [ ] 8.4 Vérification finale sur appareil physique : créer, éditer, supprimer, exécuter un code USSD