## Purpose

Ajoute à la spec `public-distribution` l'exigence d'illustrer le problème résolu par l'application : un exemple concret de formule USSD à variables, sa substitution et le lancement dans le dialer, présenté dans les deux langues du site.

## ADDED Requirements

### Requirement: Illustration du cas d'usage
Le système SHALL illustrer le problème résolu par l'application avec un exemple concret : une formule USSD comportant des variables (`{NUMERO}`, `{MONTANT}`), leur substitution par des valeurs, et l'ouverture du dialer avec la formule composée. L'exemple SHALL être présenté dans les deux langues du site.

#### Scenario: Exemple affiché
- **WHEN** le visiteur consulte la section exemple
- **THEN** la page montre une formule USSD à variables, la formule substituée et l'ouverture du dialer pré-rempli

#### Scenario: Exemple bilingue
- **WHEN** le visiteur bascule la langue de la page
- **THEN** les libellés et le nom de l'exemple sont affichés dans la langue choisie