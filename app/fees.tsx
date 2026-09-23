import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  formatAr,
  isValidAmount,
  optimalSplit,
  RETRAIT_PLAN,
  transferAmountFor,
  TRANSFERT_PLAN,
} from '@/lib/fees';
import { keyboardFor } from '@/lib/keyboard';

type Mode = 'retrait' | 'transfert';

const MODES: { id: Mode; label: string }[] = [
  { id: 'retrait', label: 'Retrait' },
  { id: 'transfert', label: 'Transfert' },
];

export default function FeesScreen() {
  const [mode, setMode] = useState<Mode>('retrait');
  const [raw, setRaw] = useState('');
  const [withRetraitFees, setWithRetraitFees] = useState(false);

  const amountText = raw.replace(/[^0-9]/g, '');
  const amount = amountText === '' ? NaN : Number(amountText);
  const plan = mode === 'retrait' ? RETRAIT_PLAN : TRANSFERT_PLAN;
  const term = mode === 'retrait' ? 'retrait' : 'transfert';

  const netError =
    amountText !== '' && !isValidAmount(amount, plan)
      ? `Saisissez un montant de ${formatAr(plan.minAmount)} à ${formatAr(plan.maxAmount)}`
      : undefined;

  // Montant transféré : net reçu + frais de retrait(net) si l'option est cochée.
  const transferAmount = useMemo(() => {
    if (amountText === '' || netError != null) return NaN;
    return transferAmountFor(amount, mode === 'transfert' && withRetraitFees);
  }, [amountText, netError, mode, withRetraitFees, amount]);

  const exceedsError =
    mode === 'transfert' &&
    withRetraitFees &&
    Number.isFinite(transferAmount) &&
    transferAmount > TRANSFERT_PLAN.maxAmount
      ? `Montant transféré trop élevé (maximum ${formatAr(TRANSFERT_PLAN.maxAmount)} avec les frais de retrait inclus)`
      : undefined;

  const error = netError ?? exceedsError;

  const result = useMemo(() => {
    if (amountText === '' || error != null || !Number.isFinite(transferAmount)) return undefined;
    return optimalSplit(transferAmount, plan);
  }, [amountText, error, transferAmount, plan]);

  const updatedAt = plan.updatedAt.split('-').reverse().join('/');

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ gap: 16, padding: 16 }}>
      <View className="flex-row rounded-lg border border-border bg-card p-1" accessibilityRole="tablist">
        {MODES.map((m) => {
          const selected = mode === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMode(m.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              className={`flex-1 items-center justify-center rounded-md py-2 ${
                selected ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              <Text className={`text-sm font-medium ${selected ? 'text-primary-foreground' : 'text-foreground'}`}>
                {m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Input
        label={mode === 'retrait' ? 'Montant à retirer' : 'Montant à transférer (net reçu)'}
        keyboardType={keyboardFor('amount')}
        value={amountText}
        onChangeText={setRaw}
        placeholder="Ex : 101 000"
        error={error}
      />

      {mode === 'transfert' && (
        <Pressable
          onPress={() => setWithRetraitFees((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: withRetraitFees }}
          className="flex-row items-start gap-2.5 rounded-lg border border-border bg-card p-4"
        >
          <View
            className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
              withRetraitFees ? 'border-primary bg-primary' : 'border-input bg-background'
            }`}
          >
            {withRetraitFees && <Text className="text-xs font-bold leading-4 text-primary-foreground">✓</Text>}
          </View>
          <View className="flex-1 gap-1">
            <Label className="text-foreground">Envoyer avec frais de retrait</Label>
            <Text className="text-xs text-muted-foreground">
              Le montant transféré inclut les frais de retrait sur le montant reçu.
            </Text>
          </View>
        </Pressable>
      )}

      {amountText === '' ? (
        <Text className="text-sm text-muted-foreground">
          Saisissez un montant : le découpage le plus économique s'affiche automatiquement.
        </Text>
      ) : (
        result != null && (
          <>
            <Card>
              <CardTitle>{term} unique</CardTitle>
              <Text className="mt-1 text-sm text-muted-foreground">
                {formatAr(transferAmount)} → frais de {formatAr(result.singleFee)}
              </Text>
            </Card>

            <Card>
              <CardTitle>Découpage optimal</CardTitle>
              {result.pieces.length === 1 && result.savings === 0 ? (
                <Text className="mt-1 text-sm text-muted-foreground">
                  Un seul {term} : c'est déjà le plus économique.
                </Text>
              ) : (
                <>
                  {result.pieces.map((piece, index) => (
                    <View key={index} className="mt-1 flex-row items-center justify-between gap-2">
                      <Text className="text-sm text-foreground">
                        {term.charAt(0).toUpperCase() + term.slice(1)} {index + 1} : {formatAr(piece.amount)}
                      </Text>
                      <Text className="text-sm text-muted-foreground">{formatAr(piece.fee)} de frais</Text>
                    </View>
                  ))}
                  <View className="mt-2 flex-row items-center justify-between gap-2 border-t border-border pt-2">
                    <Text className="text-sm text-foreground">Frais totaux</Text>
                    <Text className="text-sm font-medium text-foreground">{formatAr(result.totalFee)}</Text>
                  </View>
                </>
              )}
            </Card>

            {result.savings > 0 && (
              <View className="rounded-lg bg-muted p-4">
                <Text className="text-sm text-muted-foreground">Vous économisez</Text>
                <Text className="mt-0.5 text-2xl font-bold text-primary">{formatAr(result.savings)}</Text>
              </View>
            )}
          </>
        )
      )}

      <Text className="mt-2 text-xs text-muted-foreground">
        Barème mis à jour le {updatedAt} · Vérifiez le tarif en vigueur
      </Text>
    </ScrollView>
  );
}