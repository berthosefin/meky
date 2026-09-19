## Why

L'app fonctionne mais porte encore l'identité par défaut d'Expo : les assets `assets/*.png` d'origine ne correspondent pas à l'identité visuelle Meky alors que la nouvelle série est prête dans `assets/meky/` (logo M blanc sur fond dark). Par ailleurs, le test sur appareil réel a révélé un bug bloquant — le code USSD lancé utilise la formule brute avec `{VARIABLES}` au lieu des valeurs substituées — ainsi que des incohérences de header (titre "meky" en minuscule, header clair en mode dark).

## What Changes

- Basculer les assets Expo vers `assets/meky/` (icon, splash, adaptive icons Android, favicon) et afficher le nom de l'app en `Meky` (M majuscule) partout (launcher, en-têtes).
- Corriger le lancement USSD : composer l'URI avec les valeurs substituées (pas la formule brute), assouplir le check `canOpenURL` avec fallback `openURL` direct et message d'erreur utile si aucun dialer.
- Ajouter la config `splash` manquante (`backgroundColor: #0C1113`, `image`, `resizeMode: contain`).
- Unifier le header natif : titre `Meky` avec l'icône de l'app à gauche sur la page d'accueil (à la place du bouton retour), même style sur toutes les pages, couleurs cohérentes en mode sombre/clair.

## Capabilities

### New Capabilities

- `app-branding`: identité visuelle de l'app (assets de marque, nom affiché `Meky`, splash, cohérence des couleurs).
- `app-header`: header natif unifié et adaptatif (icône app, titre, couleurs sombre/clair).
- `ussd-launch`: lancement d'un code USSD avec les valeurs substituées depuis la page d'exécution.

### Modified Capabilities

(néant — `openspec/specs/` est vide tant que `init-meky-app` n'est pas archivée ; les capacité du changement précédent couvrent les comportements USSD de base.)

## Impact

- `app.json` : `icon`, `splash`, `android.adaptiveIcon`, `web.favicon`, nom affiché `Meky`.
- Assets : remplacement des PNG racine par ceux de `assets/meky/` (ou repointage `app.json`).
- `app/_layout.tsx` : header global natif + `StatusBar`.
- `app/index.tsx` : header d'accueil avec logo/titre.
- `src/lib/ussd.ts` et `app/code/[id].tsx` : lancement avec valeurs substituées.
- Nouveau build EAS + release GitHub après validation.