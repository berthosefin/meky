## Purpose

Permet d'exécuter un code USSD enregistré : saisir les valeurs des variables, prévisualiser la formule complète et l'envoyer au dialer Android pour lancer la session USSD.

## Requirements

### Requirement: Saisir les valeurs des variables
Le système SHALL afficher un champ de saisie pour chaque variable du code, adaptant le clavier selon la nature de la valeur attendue (numérique pour montant, téléphone pour numéro, texte par défaut). Le système SHALL afficher un aperçu en direct de la formule avec les valeurs substituées.

#### Scenario: Saisie des variables
- **WHEN** l'utilisateur ouvre un code avec les variables `NUMERO` et `MONTANT` et saisit `0340000000` puis `5000`
- **THEN** l'aperçu affiche `#1*4*1*0340000000*5000#` en direct

#### Scenario: Aperçu avec variable vide
- **WHEN** une des variables n'est pas encore renseignée
- **THEN** l'aperçu conserve la syntaxe `{NOM_VARIABLE}` pour la valeur manquante

### Requirement: Valider le code avant exécution
Le système SHALL bloquer l'exécution tant que toutes les variables obligatoires ne sont pas renseignées et indiquer à l'utilisateur quelles valeurs sont manquantes.

#### Scenario: Variables manquantes
- **WHEN** l'utilisateur tente d'exécuter avec une variable vide
- **THEN** l'exécution est bloquée et la variable manquante est signalée

#### Scenario: Toutes les variables remplies
- **WHEN** toutes les variables sont renseignées et l'utilisateur valide
- **THEN** l'application lance l'exécution du code USSD

### Requirement: Exécuter le code USSD via le dialer Android
Le système SHALL encoder la formule complète en URI `tel:` en échappant les caractères `*` et `#`, puis l'ouvrir pour déclencher le dialer système. Le dialer SHALL être invité à reconnaître la formule comme code USSD. Le système SHALL signaler à l'utilisateur qu'aucune permission d'appel n'est requise et que la session USSD démarre dans le dialer.

#### Scenario: Lancement du dialer avec code encodé
- **WHEN** la formule `#1*4*1*0340000000*5000#` est validée
- **THEN** le dialer Android s'ouvre avec l'URI `tel:%231%2A4%2A1%2A0340000000%2A5000%23`
- **AND** la session USSD démarre dans le dialer

#### Scenario: Aucun dialer disponible
- **WHEN** le système ne trouve aucun moyen d'ouvrir l'URI `tel:`
- **THEN** l'application affiche un message d'erreur indiquant l'échec du lancement

### Requirement: Aperçu de la formule avant lancement
Le système SHALL afficher la formule finale complète (avec valeurs substituées) avant que l'utilisateur ne lance l'exécution, afin qu'il puisse vérifier le code avant transmission.

#### Scenario: Vérification avant exécution
- **WHEN** l'utilisateur consulte la page d'exécution avec toutes les variables remplies
- **THEN** la formule complète substituée est visible avant le bouton d'exécution