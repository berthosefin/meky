# Spike USSD — Comportement du dialer

## Configuration du test

- **Appareil / modèle** : (à compléter)
- **Version Android** : (à compléter)
- **Dialer** : système par défaut

## Résultats

### 1. Saisie manuelle dans le dialer

- **Code testé** : `*100#` (code de solde opérateur)
- **Comportement constaté** : la session USSD ne se lance **pas automatiquement**. Il faut appuyer sur le bouton **"Appeler"** pour que le dialer exécute le code et ouvre la session USSD.

### 2. URI `tel:` encodée

- **URI testée** : `tel:%23%2A100%2A%23`
- **Comportement constaté** : le dialer s'ouvre avec le code pré-rempli et correctement reconnu comme USSD ; l'utilisateur doit valider avec **"Appeler"**.

## Conséquences pour meky

- L'approche `ACTION_DIAL` (via `Linking.openURL('tel:' + encoded)`) est **confirmée** : le code USSD est bien pré-rempli dans le dialer, prêt à être exécuté.
- **Un tap supplémentaire est attendu** de l'utilisateur ("Appeler") pour lancer la session — c'est le comportement souhaité et sûr (aucune permission `CALL_PHONE`, fonctionne sur Android 8+).
- L'envoi direct via `ACTION_CALL` n'est pas nécessaire et reste à éviter (restrictions Android 8+, permission requise).
- À retester sur chaque modèle de dialer susceptible de différer (Samsung, wallpaper...).