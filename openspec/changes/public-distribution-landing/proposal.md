## Why

Le MVP de Meky est terminé et validé sur appareil, mais le dépôt GitHub est privé : les utilisateurs (proches, et éventuellement d'autres personnes) ne peuvent pas télécharger l'APK sans compte GitHub. Il faut ouvrir un canal de distribution simple, gratuit et partageable par simple lien.

## What Changes

- Rendre le dépôt GitHub `berthosefin/meky` public et découvrirrliable (description + topics)
- Créer une landing page statique hébergée gratuitement sur GitHub Pages, avec :
  - le logo et le nom de marque « Meky » (style dark `#0C1113` cohérent avec l'app)
  - une description courte de l'application
  - un bouton « Télécharger l'APK » pointant vers le dernier artefact de release (`releases/latest/download/meky.apk`)
  - des instructions d'installation pas-à-pas (autoriser les sources inconnues, etc.)
  - une bascule de langue FR/EN (détection `navigator.language`, mémoire via `localStorage`)
- Le lien de téléchargement reste automatiquement à jour à chaque nouvelle release (aucune maintenance manuelle du lien)

## Capabilities

### New Capabilities

- `public-distribution`: Site public de distribution (landing GitHub Pages) avec téléchargement du dernier APK et documentation d'installation bilingue FR/EN. Aucune des capabilities existantes (app-branding, app-header, ussd-code-management, ussd-code-execution, ussd-launch) n'est modifiée — le comportement de l'application elle-même ne change pas.

### Modified Capabilities

<!-- Aucune -->

## Impact

- Dépôt GitHub : `berthosefin/meky` passe de private à public (aucun secret commité — `.gitignore` couvre keystore/.env, `git ls-files` vérifié sans fichier sensible)
- Nouveau dossier `docs/` à la racine : page statique unique `index.html` (HTML/CSS/JS inline, aucun framework, aucun build)
- GitHub Pages activé sur la branche `main`, dossier `/docs` → site à `https://berthosefin.github.io/meky/`
- Release `v1.0.0` existante réutilisée : l'APK universel (107 MB) reste l'artefact de téléchargement, le lien `releases/latest` le cible automatiquement
- Aucun changement de code applicatif, aucune dépendance ajoutée, aucun service tiers (pas de back-end, pas de store)