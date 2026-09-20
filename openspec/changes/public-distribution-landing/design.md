## Context

Meky est un MVP Android (Expo/React Native) terminé, distribué via une release GitHub `v1.0.0` (APK universel 107 MB) sur un dépôt privé. La motivation de ce change est dans proposal.md — Why : ouvrir un canal de distribution public partageable par lien, sans coût ni service tiers.

État contraignant : le dépôt `berthosefin/meky` est privé (assets de release non téléchargeables sans auth), aucun secret commité (le passage en public est sans risque), `eas.json` produit des APK universels, la release `v1.0.0` existe déjà.

## Goals / Non-Goals

**Goals**
- Rendre le dépôt public pour autoriser le téléchargement anonyme des assets de release
- Publier une landing page statique unique, gratuite, sans build, sur GitHub Pages
- Lien de téléchargement stable et auto-à-jour vers `releases/latest/download/meky.apk`
- Bascule de langue FR/EN légère dans une page statique

**Non-Goals**
- Play Store, autres stores, back-end, analytics, tracking d'utilisateurs
- Réduction de la taille de l'APK (arm64 split) — décision reportée, l'APK universel est conservé
- i18n avancée (frameworks, fichiers de traduction séparés, router) — une seule page suffit
- CDN payant ou hébergement externe

## Decisions

**D1 — Repo public via `gh repo edit`**
Passer `berthosefin/meky` en `--visibility public` et ajouter description + topics.
Alternatives considérées : garder le repo privé et héberger l'APK ailleurs (Netlify, transfert ponctuel) — plus de friction à chaque release ; le repo public + GitHub Pages est le chemin le plus court vers un lien de téléchargement direct toujours à jour.

**D2 — Landing statique dans `docs/index.html`, pas de framework**
Une seule page HTML/CSS/JS inline dans un nouveau dossier `docs/` à la racine. GitHub Pages est activé sur `main`/`docs`.
Alternatives : Vite/React + pipeline de build → surdimensionné pour une page unique ; `gh-pages` via workflow → complexité inutile tant que `docs/` suffit.
Risque assumé : GitHub Pages sert un site statique sans back-end — parfait ici (pas d'état serveur).

**D3 — Téléchargement via `releases/latest/download/meky.apk`**
Le bouton « Télécharger l'APK » cible ce lien déterministe de GitHub : il résout automatiquement vers le dernier APK publié de la dernière release, quel que soit le tag.
Alternatives : interroger l'API GitHub en JS pour construire l'URL → dépendance réseau supplémentaire et risque CORS ; un lien statique vers un asset précis → pointage obsolète à la prochaine release. Le lien `latest/download/<name>` résout tout.

**D4 — Bascule FR/EN en pur JS inline (~30 lignes)**
Deux jeux de textes stockés dans des objets JS indexés par clé (`fr`/`en`), un bouton de bascule qui applique `textContent` sur les éléments marqués `data-i18n`, détection initiale via `navigator.language` (défaut `fr` si non anglaise), persistance via `localStorage`.
Alternatives : `lang` alternatif dans des divs cachés → duplication DOM fragile ; génération côté serveur → pas de plateforme serveur sur Pages. Le `data-i18n` est le plus simple et pensable pour une page unique.

**D5 — Réutilisation de la release existante**
Aucune nouvelle release ni upload : l'APK `v1.0.0` reste l'artefact ciblé. La landing ne sera pas versionnée.

## Risks / Trade-offs

- [Passage en public] → Vérifié : aucun secret commité ; `.gitignore` couvre keystore/.env ; assets de marque et code applicatif n'ont rien de sensible.
- [APK universel 107 MB lourd pour un partage par message] → Accepté pour v1 du site ; le changement de build (arm64 split) est documenté comme évolution possible mais hors scope.
- [Site statique sans HTTPS custom] → Géré nativement par GitHub Pages (HTTPS automatique).
- [Bascule de langue dépend de JS] → Acceptable : en l'absence de JS, le contenu par défaut (français) reste lisible.

## Migration Plan

1. `gh repo edit berthosefin/meky --visibility public` (+ description/topics)
2. Créer `docs/index.html` (contenu FR/EN + styles + bascule)
3. Activer GitHub Pages sur `main`/`docs`
4. Vérifier : page accessible, téléchargement OK, bascule FR/EN OK

Rollback : repasser le repo en privé (le site Pages devient inaccessible) ; supprimer `docs/` si besoin.

## Open Questions

Aucune — les décisions d'approche (repo public, `docs/`, lien `releases/latest`, i18n inline) sont résolues et n'affectent ni les specs ni la décomposition des tâches.