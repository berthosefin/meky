## Purpose

Gère le carnet de codes USSD de l'utilisateur : enregistrer, lister, modifier et supprimer des codes avec leurs variables nommées, le tout stocké hors-ligne sur l'appareil.

## ADDED Requirements

### Requirement: Enregistrer un code USSD
Le système SHALL permettre de créer un code USSD composé d'un nom et d'une formule contenant des variables au format `{NOM_VARIABLE}`. Le système SHALL détecter automatiquement chaque variable unique présente dans la formule et la présenter comme champ à remplir. Un code créé SHALL être persisté localement et immédiatement visible dans la liste des codes.

#### Scenario: Création réussie avec variables détectées
- **WHEN** l'utilisateur saisit un nom "MVola Retrait" et la formule `#1*4*1*{NUMERO}*{MONTANT}#` puis enregistre
- **THEN** le code est sauvegardé avec les variables `NUMERO` et `MONTANT` détectées automatiquement
- **AND** le code apparaît dans la liste de la page Home

#### Scenario: Aperçu des variables vide
- **WHEN** la formule saisie ne contient aucune variable `{...}`
- **THEN** le code est enregistré sans variable à remplir

#### Scenario: Variables en double
- **WHEN** la formule contient `{MONTANT}` plusieurs fois
- **THEN** une seule variable `MONTANT` est proposée à l'utilisateur

#### Scenario: Formule sans nom
- **WHEN** l'utilisateur tente d'enregistrer sans nom
- **THEN** le système empêche la sauvegarde et indique que le nom est requis

### Requirement: Lister les codes enregistrés
Le système SHALL afficher sur la page Home la liste de tous les codes enregistrés, chacun avec son nom et un aperçu de sa formule. En l'absence de code, le système SHALL afficher un état vide avec une invitation à créer un premier code.

#### Scenario: Affichage des codes
- **WHEN** au moins un code est enregistré
- **THEN** la Home liste chaque code avec nom et formule

#### Scenario: Aucun code enregistré
- **WHEN** aucun code n'est enregistré
- **THEN** la Home affiche un message invitant à créer un premier code

### Requirement: Modifier un code USSD
Le système SHALL permettre de modifier le nom et la formule d'un code existant. Les variables sont re-détectées depuis la formule modifiée et remplacées dans la fiche du code. Une modification SHALL être persistée et reflétée dans la liste.

#### Scenario: Modification d'un code
- **WHEN** l'utilisateur modifie la formule d'un code existant et valide
- **THEN** le code est mis à jour avec sa nouvelle formule et ses nouvelles variables
- **AND** la liste de la page Home reflète le changement

### Requirement: Supprimer un code USSD
Le système SHALL permettre de supprimer un code. La suppression SHALL être confirmée avant d'être effective et irréversible.

#### Scenario: Suppression confirmée
- **WHEN** l'utilisateur demande la suppression d'un code et confirme
- **THEN** le code est définitivement retiré
- **AND** il n'apparaît plus dans la liste de la Home

#### Scenario: Suppression annulée
- **WHEN** l'utilisateur demande la suppression mais annule la confirmation
- **THEN** le code reste inchangé

### Requirement: Persistance hors-ligne
Le système SHALL stocker tous les codes localement sur l'appareil et fonctionner sans aucune connexion réseau.

#### Scenario: Données persistées après fermeture
- **WHEN** l'utilisateur quitte puis rouvre l'application
- **THEN** tous les codes enregistrés sont toujours présents et identiques

#### Scenario: Fonctionnement hors-ligne
- **WHEN** l'appareil est en mode avion
- **THEN** l'application fonctionne normalement et toutes les fonctionnalités restent disponibles