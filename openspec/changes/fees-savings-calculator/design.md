## Context

Meky est un carnet de codes USSD universel, hors-ligne, sans back-end (React Native/Expo, MMKV, thème zinc, UI en français). La landing « universelle » a été livrée sans aucune mention géographique ni d'opérateur. L'utilisateur veut une **page « Frais & économies »** : saisir un montant de retrait, voir les frais d'un retrait unique et le **découpage optimal** minimisant les frais totaux, avec l'économie réalisée. Contraintes votées : barème **générique non-marqué** (aucun nom MVola/OM/Airtel à l'écran), feature **cachée** (hors marketing et specs publiques), **pas de plafond** de retraits ni de limites, **pièce minimale 100 Ar**.

La grille réelle (captures du 20/09/2026, OCR) : frais constants par palier, de 100 Ar (100–1 000 Ar) jusqu'à 100 000 Ar (19–20 M Ar), avec le « piège » du palier 100 001–250 000 Ar (3 400 Ar). Exemple validé : 101 000 Ar → 100 000 (1 900) + 1 000 (100) = 2 000 Ar au lieu de 3 400 (économie 1 400).

## Goals / Non-Goals

**Goals**
- Fournir un écran isolé de calcul (frais unique + découpage optimal + économie) sans toucher au carnet
- Modéliser le barème comme donnée générique versionnée, prête à accueillir d'autres services (même structure)
- Garder la feature invisible du marketing (repo, landing, specs `public-distribution`)

**Non-Goals**
- Plafonds/limites de retraits, limites quotidiennes ou d'agence (modélisés uniquement les frais par paliers)
- Référence à un opérateur ou pays dans l'interface
- Modification du modèle `UssdCode`, du stockage, de l'écran d'exécution ou des specs de distribution
- Affichage du barème en entier ou export ; aucune dépendance nouvelle

## Decisions

**D1 — Registre de barèmes générique et versionné (`src/lib/fees.ts`)**
Un seul type et une seule source :
```ts
type FeeBand = { min: number; max: number; fee: number };
type FeePlan = { id: string; updatedAt: string; minAmount: number;
                 maxAmount: number; bands: FeeBand[] };
feeFor(amount, plan)      // frais d'un retrait unique
optimalSplit(amount, plan) // { pieces: {amount, fee}[], totalFee, singleFee, savings }
```
Le plan embarqué (`retrait` en Ariary, `updatedAt: '2026-09-20'`, bornes 100…20 000 000 Ar, 31 paliers des captures) est nommé de façon **générique** (`id: 'retrait'`), sans marque. Les futurs services (même structure tarifaire) s'ajouteront comme plans supplémentaires sans changer l'écran.

**D2 — Optimiseur : minimisation exacte, sans plafond de retraits**
La fee est constante par palier ⇒ les pièces optimales sont des **hauts de paliers** plus éventuellement un **reste**. Résolution par programmation dynamique non bornée sur les hauts de paliers + reste (Σ fee minimale, somme exacte), jusqu'à la dernière bande. Caractérisation : l'optimum produit naturellement 1 à 3 retraits sur ce barème (le tarif décourage les découpages absurdes) — aucune plafond artificiel ajouté (décision utilisateur). Complexité O(montant × paliers), triviale pour les montants réels (≤ quelques dizaines de milliers d'états).
Alternatives : heuristique « découper au palier inférieur » → fausse (ex. 240 000 gagne en retrait unique) ; plafond arbitraire du nombre de retraits → refusé (décision utilisateur) ; branche-and-bound → sur-ingénierie.

**D3 — Bornes de saisie**
Montant < `minAmount` (100 Ar) **ou** > `maxAmount` (20 000 000 Ar, fin du barème) → message d'erreur explicite, aucun calcul. Le spec couvre explicitement le minimum ; le plafond de saisie est le prolongement naturel (le barème ne va pas plus haut) — documenté ici.

**D4 — Écran `app/fees.tsx` + route**
Nouvelle route dans le Stack (`<Stack.Screen name="fees" options={{ title: 'Frais & économies' }} />`). Écran : `ScrollView`, `Input` clavier `numeric` (réutilise `keyboardFor('amount')`), puis trois cartes de résultat : « Retrait unique » (frais), « Découpage optimal » (un retrait par ligne : montant + frais, puis frais totaux), « Vous économisez » (montant + style accent). Une note discrète en pied : « Barème mis à jour le {updatedAt} · Vérifiez le tarif en vigueur ».
Alternatives : intégrer le calcul dans l'écran d'exécution → rejeté (dérive du carnet, conditionnel à un barème rattaché — prévu comme évolution future possible) ; page sans route Stack dédiée → navigation incohérente.

**D5 — Entrée discrète sur l'accueil**
`Stack.Screen options` de `app/index.tsx` : `headerRight` = icône `calculator-outline` (Ionicons, `useIconColor()`, hitSlop), sans libellé ni texte commercial, `router.push('/fees')`. Aucune mention dans l'empty state, la landing ou le repo.
Alternatives : seconde carte dans la liste → bruyante ; entrée dans les réglages (qui n'existent pas) → trop cachée pour être utile aux proches.

**D6 — Formatage des montants**
Entier en Ariary, affiché via `Intl.NumberFormat('fr-FR')` + suffixe « Ar » (ex. « 101 000 Ar »). Les montants de retrait sont des entiers.

## Risks / Trade-offs

- [Le barème embarqué vieillit (app hors-ligne)] → Mitigation : date de MAJ affichée + note « vérifiez le tarif en vigueur » ; mise à jour = bump de `updatedAt` + nouvelle release.
- [Montants très élevés (proches de 20 M Ar) ralentissent le DP] → Mitigation : DP sur hauts de paliers + reste (états bornés par le nombre de paliers, pas par le montant) ; les montants réalistes sont de toute façon ≤ quelques centaines de milliers d'Ar.
- [Le calcul affiche une recommandation qui dépend de données externes (précision)] → Mitigation : la note de fraîcheur et l'absence de marque gardent l'écran générique et honnête ; les valeurs sont vérifiées par tests unitaires sur des cas réels.
- [Feature cachée : découvrabilité faible] → Mitigation : c'est un choix assumé (découverte orale auprès des proches) ; l'icône header est visible une fois l'app ouverte.

## Migration Plan

- Changement strictement additif (nouveau fichier + nouvel écran + icône header) : aucun risque de régression de flux existants.
- Déployé par la prochaine release APK (même canal que l'existant, pas de dépendance nouvelle).
- Rollback : retirer la route, le fichier et l'icône ; le stockage et les codes existants ne sont pas touchés.

## Open Questions

- Afficher le barème complet dans l'écran (table repliable) ? Non requis par la spec ; possible plus tard sans changer l'architecture.
- Formater l'économie aussi en pourcentage du montant ? Non requis ; ajout cosmétique possible plus tard.