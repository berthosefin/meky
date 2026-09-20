## Purpose

Nouvelle capability `fees-calculator` : un écran de calcul des frais de retrait d'argent mobile et d'optimisation du découpage, basé sur un barème générique non-marqué intégré et versionné. La feature reste volontairement discrète (hors marketing et hors specs de distribution).

## Requirements

### Requirement: Calcul des frais et économies
Le système SHALL calculer, pour un montant saisi en Ariary, les frais d'un retrait unique selon le barème embarqué et le meilleur découpage en retraits multiples minimisant les frais totaux. Le système SHALL afficher le nombre de retraits, les montants respectifs, les frais de chaque retrait, les frais totaux du découpage, ainsi que l'économie réalisée par rapport au retrait unique. Si le montant saisi est inférieur au minimum du barème (100 Ar) ou n'est pas un nombre, le système SHALL afficher un message d'erreur explicite.

#### Scenario: Découpage optimal affiché
- **WHEN** l'utilisateur saisit un montant valide d'au moins 100 Ar
- **THEN** l'écran affiche les frais du retrait unique, le découpage optimal (nombre de retraits et montants), les frais totaux et l'économie réalisée

#### Scenario: Montant sous le minimum
- **WHEN** l'utilisateur saisit un montant inférieur à 100 Ar ou non numérique
- **THEN** l'écran affiche un message d'erreur explicite et aucun calcul

### Requirement: Barème générique non-marqué
Aucune marque d'opérateur (nom commercial, sigle, logo) ne SHALL apparaître dans l'écran de calcul. Le barème SHALL être présenté comme un tarif de retrait commun, sans référence à un opérateur ou un pays.

#### Scenario: Aucune marque affichée
- **WHEN** l'utilisateur consulte l'écran de calcul et ses résultats
- **THEN** aucun nom, sigle ou logo d'opérateur n'apparaît, et les libellés restent génériques

### Requirement: Fraîcheur des données du barème
Le barème embarqué SHALL porter une date de mise à jour. L'écran SHALL afficher cette date ainsi qu'une note invitant à vérifier le tarif en vigueur auprès de son service.

#### Scenario: Date et note affichées
- **WHEN** l'utilisateur consulte l'écran de calcul
- **THEN** la date de mise à jour du barème et la note « vérifier le tarif en vigueur » sont visibles

### Requirement: Entrée discrète
Le système SHALL rendre la calculatrice accessible depuis l'écran d'accueil via une entrée discrète (icône sans libellé commercial). La fonctionnalité ne figure pas dans la description du produit ni dans la landing de distribution.

#### Scenario: Accès par icône discrète
- **WHEN** l'utilisateur consulte l'écran d'accueil
- **THEN** une icône sans libellé commercial permet d'ouvrir l'écran de calcul