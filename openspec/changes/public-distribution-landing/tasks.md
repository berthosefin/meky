## 1. Passage du dépôt en public

- [ ] 1.1 Passer le repo public : `gh repo edit berthosefin/meky --visibility public`
- [ ] 1.2 Ajouter description et topics (ex. `ussd`, `expo`, `android`, `madagascar`) via `gh repo edit`
- [ ] 1.3 Vérifier qu'aucun artefact de build/dépendance n'est commité par accident (`git ls-files` relu)

## 2. Landing page statique

- [ ] 2.1 Créer le dossier `docs/` à la racine du repo
- [ ] 2.2 Créer `docs/index.html` : structure single-page avec header (logo + « Meky »), section hero (description), bouton « Télécharger l'APK » → `https://github.com/berthosefin/meky/releases/latest/download/meky.apk`
- [ ] 2.3 Ajouter une section « Comment installer » (étapes : autoriser les sources inconnues, ouvrir le fichier, confirmer)
- [ ] 2.4 Appliquer l'identité visuelle : logo de marque, fond sombre `#0C1113`, texte lisible (styles CSS inline, responsive mobile-first)

## 3. Contenu bilingue FR/EN

- [ ] 3.1 Marquer les éléments traduisibles avec `data-i18n` et construire deux jeux de textes (`fr`/`en`)
- [ ] 3.2 Implémenter la bascule de langue en JS inline : rendu par `navigator.language`, défaut `fr` si non anglaise
- [ ] 3.3 Persister le choix de langue via `localStorage` et bouton de bascule visible dans le header
- [ ] 3.4 Vérifier : bascule immédiate, langue initiale détectée, préférence mémorisée

## 4. GitHub Pages et vérification

- [ ] 4.1 Activer GitHub Pages sur la branche `main`, dossier `/docs`
- [ ] 4.2 Vérifier l'accès public : `https://berthosefin.github.io/meky/` charge sans connexion
- [ ] 4.3 Vérifier que le bouton de téléchargement récupère bien le dernier APK (`meky.apk`, v1.0.0)
- [ ] 4.4 Commit final : `feat: public landing page with FR/EN download`