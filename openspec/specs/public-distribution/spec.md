## Purpose

Fournit un site public de distribution pour Meky : une landing page bilingue FR/EN hébergée sur GitHub Pages, avec un bouton de téléchargement du dernier APK et des instructions d'installation.

## Requirements

### Requirement: Site public accessible sans compte GitHub
Le système SHALL publier un site web public accessible sans authentification, décrivant l'application Meky et permettant le téléchargement de l'APK. Le site SHALL utiliser l'identité visuelle de l'application (logo M, nom « Meky », fond sombre `#0C1113`).

#### Scenario: Accès au site
- **WHEN** un visiteur ouvre l'URL du site
- **THEN** la landing page s'affiche sans demande de connexion

#### Scenario: Identité visuelle cohérente
- **WHEN** le visiteur consulte la page
- **THEN** le site affiche le logo de marque, le nom « Meky » et un fond sombre cohérent avec l'application

### Requirement: Téléchargement du dernier APK
Le système SHALL fournir un bouton de téléchargement pointant vers le dernier APK publié. Le lien SHALL rester valide et à jour sans action manuelle à chaque nouvelle publication de release.

#### Scenario: Téléchargement direct
- **WHEN** le visiteur clique sur le bouton de téléchargement
- **THEN** le dernier APK publié est téléchargé

#### Scenario: Mise à jour automatique du lien
- **WHEN** une nouvelle release avec APK est publiée
- **THEN** le bouton de téléchargement pointe toujours vers cet APK, sans modification du site

### Requirement: Instructions d'installation
Le système SHALL afficher des instructions pas-à-pas pour installer l'APK sur Android, incluant l'autorisation d'installation depuis des sources inconnues et les étapes de confirmation système.

#### Scenario: Étapes d'installation affichées
- **WHEN** le visiteur consulte la section d'installation
- **THEN** les étapes d'autorisation et d'installation sont affichées de manière claire et ordonnée

### Requirement: Contenu bilingue FR/EN
Le système SHALL proposer le contenu de la page en français et en anglais. La langue initiale SHALL être choisie selon la langue du navigateur du visiteur, en défaut sur le français si la langue n'est pas détectée comme anglaise. La préférence de langue choisie par le visiteur SHALL être mémorisée pour ses visites suivantes.

#### Scenario: Bascule manuelle de langue
- **WHEN** le visiteur active la bascule vers l'autre langue
- **THEN** tout le contenu de la page bascule immédiatement

#### Scenario: Langue initiale détectée
- **WHEN** le visiteur ouvre la page avec un navigateur en anglais
- **THEN** le contenu initial est affiché en anglais

#### Scenario: Préférence mémorisée
- **WHEN** le visiteur revient après avoir choisi une langue
- **THEN** la langue précédemment choisie est affichée