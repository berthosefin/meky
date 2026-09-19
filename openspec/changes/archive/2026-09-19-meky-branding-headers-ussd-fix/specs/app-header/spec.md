## Purpose

Définit l'en-tête natif unifié de l'application : identique sur toutes les pages, adapté au thème sombre/clair du téléphone, avec l'icône de l'application à la place du bouton retour sur la page d'accueil.

## ADDED Requirements

### Requirement: En-tête unifié sur toutes les pages
Le système SHALL afficher un en-tête natif de style identique sur toutes les pages (accueil, ajout, édition, exécution) : même hauteur, même typographie, mêmes couleurs. Le titre de l'en-tête SHALL être "Meky".

#### Scenario: En-tête identique partout
- **WHEN** l'utilisateur navigue entre l'accueil, l'ajout, l'édition et l'exécution
- **THEN** l'en-tête garde un style visuel cohérent sur chaque page

#### Scenario: Titre de l'en-tête
- **WHEN** l'utilisateur regarde l'en-tête d'une page
- **THEN** le titre affiché est "Meky"

### Requirement: En-tête adapté au thème du téléphone
Le système SHALL adapter les couleurs de l'en-tête (fond et texte) au thème clair ou sombre de l'appareil. Le fond de l'en-tête SHALL suivre la couleur de fond du thème actif, y compris en mode sombre.

#### Scenario: Mode sombre actif
- **WHEN** le téléphone est en mode sombre
- **THEN** l'en-tête utilise un fond sombre cohérent avec le reste de l'application

#### Scenario: Mode clair actif
- **WHEN** le téléphone est en mode clair
- **THEN** l'en-tête utilise un fond clair cohérent avec le reste de l'application

#### Scenario: Changement de thème à chaud
- **WHEN** l'utilisateur change le thème du téléphone pendant que l'application est ouverte
- **THEN** l'en-tête s'adapte au nouveau thème

### Requirement: Icône de l'application sur l'accueil
Le système SHALL afficher l'icône de l'application (logo Meky) à gauche de l'en-tête sur la page d'accueil, à la place du bouton retour qui n'a pas lieu d'être sur la page racine.

#### Scenario: Accueil avec icône
- **WHEN** l'utilisateur consulte la page d'accueil
- **THEN** l'en-tête affiche l'icône de l'application et pas de bouton retour

#### Scenario: Sous-pages avec retour
- **WHEN** l'utilisateur consulte une sous-page (ajout, édition, exécution)
- **THEN** l'en-tête conserve le bouton retour natif de navigation
- **AND** l'icône de l'application peut être masquée au profit du bouton retour