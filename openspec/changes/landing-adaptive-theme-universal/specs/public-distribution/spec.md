## Purpose

Adapte la spec `public-distribution` aux choix de la refonte : identité visuelle adaptative exactement calquée sur l'app (sombre/clair, palette zinc), thème suivi automatiquement depuis le système, et message universel sans restriction géographique.

## MODIFIED Requirements

### Requirement: Site public accessible sans compte GitHub
Le système SHALL publier un site web public accessible sans authentification, décrivant l'application Meky et permettant le téléchargement de l'APK. Le site SHALL réutiliser l'identité visuelle de l'application : logo de marque, nom « Meky », icône de l'application affichée telle quelle dans une forme d'icône d'app arrondie, et palette adaptative identique à celle de l'application (fond `#09090B` en sombre / `#FAFAFA` en clair, carte `#18181B` / `#FFFFFF`, bouton primary `#E4E4E7` / `#0F172A`, bordures `#27272A` / `#E4E4E7`).

#### Scenario: Accès au site
- **WHEN** un visiteur ouvre l'URL du site
- **THEN** la landing page s'affiche sans demande de connexion

#### Scenario: Identité visuelle cohérente
- **WHEN** le visiteur consulte la page dans un thème sombre ou clair
- **THEN** le site affiche le logo de marque, le nom « Meky », l'icône de l'application dans une forme arrondie, et une palette conforme à celle de l'application dans le thème actif

### Requirement: Contenu bilingue FR/EN
Le système SHALL proposer le contenu de la page en français et en anglais. La langue initiale SHALL être choisie selon la langue du navigateur du visiteur, en défaut sur le français si la langue n'est pas détectée comme anglaise. La préférence de langue choisie par le visiteur SHALL être mémorisée pour ses visites suivantes. Le contenu SHALL décrire Meky comme un carnet de codes USSD sans restriction géographique ni mention de pays d'origine.

#### Scenario: Bascule manuelle de langue
- **WHEN** le visiteur active la bascule vers l'autre langue
- **THEN** tout le contenu de la page bascule immédiatement

#### Scenario: Langue initiale détectée
- **WHEN** le visiteur ouvre la page avec un navigateur en anglais
- **THEN** le contenu initial est affiché en anglais

#### Scenario: Préférence mémorisée
- **WHEN** le visiteur revient après avoir choisi une langue
- **THEN** la langue précédemment choisie est affichée

#### Scenario: Aucune restriction géographique
- **WHEN** le visiteur lit la description de l'application
- **THEN** le message décrit un carnet de codes USSD universel, sans mention de pays d'origine

## ADDED Requirements

### Requirement: Thème adaptatif sombre/clair
Le système SHALL suivre automatiquement la préférence de thème du système du visiteur via `prefers-color-scheme`, sans bascule manuelle ni persistance de choix, comme l'application (mode système natif). Le contenu SHALL rester lisible et conforme à la palette définie dans les deux thèmes, y compris le logo et les icônes.

#### Scenario: Mode sombre système
- **WHEN** le système du visiteur est en thème sombre
- **THEN** la page utilise la palette sombre de l'application et reste lisible

#### Scenario: Mode clair système
- **WHEN** le système du visiteur est en thème clair
- **THEN** la page utilise la palette claire de l'application et reste lisible, logo et icônes compris