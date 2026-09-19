## Purpose

Définit le comportement de lancement d'un code USSD depuis la page d'exécution : composer l'URI avec les valeurs substituées, ouvrir le dialer Android et informer l'utilisateur en cas d'échec.

## Requirements

### Requirement: Lancement avec valeurs substituées
Le système SHALL lancer le code USSD en substituant chaque variable par la valeur saisie par l'utilisateur. La formule brute contenant `{NOM_VARIABLE}` ne SHALL jamais être transmise au dialer.

#### Scenario: Lancement avec formule substituée
- **WHEN** l'utilisateur saisit `0340000000` pour `NUMERO` et `5000` pour `MONTANT` puis exécute
- **THEN** le dialect lance l'URI `tel:` encodé correspondant à `#1*4*1*0340000000*5000#`
- **AND** la formule brute avec `{...}` n'est pas transmise

### Requirement: Encodage de l'URI tel
Le système SHALL encoder l'URI `tel:` en échappant `#` en `%23` et `*` en `%2A` pour que le dialer reconnaisse la formule comme code USSD.

#### Scenario: Code encodé correctement
- **WHEN** la formule substituée est `#1*4*1*0340000000*5000#`
- **THEN** l'URI envoyée est `tel:%231%2A4%2A1%2A0340000000%2A5000%23`

### Requirement: Gestion robuste de l'ouverture du dialer
Le système SHALL ouvrir le dialer via l'URI `tel:` dès que possible. Si l'ouverture directe échoue malgré une URI apparemment supportée, le système SHALL tenter une ouverture directe et, en dernier recours, afficher un message d'erreur explicite expliquant qu'aucun dialer n'a pu lancer le code.

#### Scenario: Dialer disponible
- **WHEN** l'URI `tel:` peut être ouverte
- **THEN** le dialer s'ouvre avec le code USSD pré-rempli

#### Scenario: Aucun dialer disponible
- **WHEN** aucun dialer ne peut traiter l'URI `tel:`
- **THEN** le système affiche un message d'erreur signalant l'échec et invitant à vérifier la présence d'une application téléphone

#### Scenario: Échec à l'ouverture effective
- **WHEN** l'URI semble supportée mais l'ouverture effective échoue
- **THEN** le système communique l'échec à l'utilisateur avec un message explicite