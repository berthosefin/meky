## Purpose

Définit l'identité visuelle de l'application Meky : le nom affiché, les icônes de marque (logo M blanc sur fond dark), l'écran de démarrage et leur cohérence dans tout l'environnement Android.

## Requirements

### Requirement: Nom de l'application affiché en "Meky"
Le système SHALL afficher le nom de l'application avec un M majuscule ("Meky") dans le lanceur Android et dans les en-têtes de l'application. Aucun affichage ne SHALL montrer le nom en minuscules ("meky").

#### Scenario: Nom dans le lanceur
- **WHEN** l'utilisateur installe l'application
- **THEN** le nom visible sous l'icône dans le lanceur Android est "Meky"

#### Scenario: Nom dans l'en-tête
- **WHEN** l'utilisateur ouvre l'application
- **THEN** le titre de l'en-tête affiche "Meky"

### Requirement: Icônes de marque utilisées dans tout l'environnement
Le système SHALL utiliser les assets de marque fournis dans `assets/meky/` pour l'icône d'application, l'icône adaptative Android (foreground, background, monochrome) et le favicon web. Aucun asset placeholder Expo par défaut ne SHALL être utilisé.

#### Scenario: Icône d'application
- **WHEN** la build est générée
- **THEN** l'icône de l'application embarque le logo Meky (M blanc) des assets `assets/meky/`

#### Scenario: Icône adaptative Android
- **WHEN** l'application est installée sur Android 8+
- **THEN** le système affiche l'icône adaptative composée du foreground/background/monochrome de `assets/meky/`

#### Scenario: Favicon web
- **WHEN** l'application est consultée sur le web
- **THEN** le favicon affiché est celui de `assets/meky/favicon.png`

### Requirement: Écran de démarrage (splash) cohérent
Le système SHALL afficher un écran de démarrage utilisant le splash-icon de marque sur fond `#0C1113` avec un mode de redimensionnement `contain`, cohérent avec l'identité visuelle dark de l'application.

#### Scenario: Affichage au démarrage
- **WHEN** l'utilisateur ouvre l'application
- **THEN** un écran de démarrage s'affiche avec le logo de marque centré sur le fond `#0C1113`