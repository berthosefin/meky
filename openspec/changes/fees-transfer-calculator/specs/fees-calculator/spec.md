## MODIFIED Requirements

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

### Requirement: Calcul des frais de transfert
Le système SHALL permettre de calculer les **frais de transfert** en plus des frais de retrait. Pour un montant saisi (montant **net reçu** par le destinataire), le système SHALL calculer les frais de transfert appliqués au montant transféré selon le barème de transfert embarqué, et afficher le découpage optimal (nombre d'envois, montants, frais par envoi, frais totaux et économie par rapport à un envoi unique), sans afficher de marque d'opérateur.

#### Scenario: Calcul de frais de transfert avec envoi unique vs optimal
- **WHEN** l'utilisateur sélectionne le mode « Transfert », saisit un montant net reçu valide (≥ minimum du barème de transfert)
- **THEN** l'écran affiche les frais d'un envoi unique, le découpage optimal (nombre, montants, frais par envoi), les frais totaux et l'économie réalisée

#### Scenario: Montant invalide en mode transfert
- **WHEN** l'utilisateur saisit un montant inférieur au minimum du barème de transfert ou non numérique en mode Transfert
- **THEN** l'écran affiche un message d'erreur explicite et aucun calcul

### Requirement: Option frais de retrait inclus
En mode « Transfert », le système SHALL proposer une case à cocher « Envoyer avec frais de retrait ». Si la case est **non cochée**, le montant transféré = montant net saisi. Si la case est **cochée**, le montant transféré = montant net saisi + frais de retrait calculés sur le montant net saisi (selon le barème de retrait). Le calcul des frais de transfert et du découpage optimal SHALL être effectué sur ce montant transféré. Si le montant transféré > 20 000 000 Ar, le système SHALL afficher un message d'erreur explicite.

#### Scenario: Transfert sans frais de retrait inclus
- **WHEN** le mode Transfert est sélectionné, la case « Envoyer avec frais de retrait » est décochée, et l'utilisateur saisit un montant net reçu valide
- **THEN** le montant transféré utilisé est égal au montant net saisi ; les frais de transfert sont calculés sur ce montant

#### Scenario: Transfert avec frais de retrait inclus
- **WHEN** le mode Transfert est sélectionné, la case « Envoyer avec frais de retrait » est cochée, et l'utilisateur saisit un montant net reçu valide
- **THEN** le montant transféré utilisé est égal au montant net saisi + frais de retrait du montant net saisi ; les frais de transfert et l'optimisation sont calculés sur ce montant transféré

#### Scenario: Plafond dépassé avec frais de retrait inclus
- **WHEN** la case « Envoyer avec frais de retrait » est cochée et (montant net + frais de retrait sur ce net) > 20 000 000 Ar
- **THEN** le système affiche un message d'erreur explicite et aucun calcul