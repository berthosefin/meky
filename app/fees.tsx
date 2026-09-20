import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatAr, isValidAmount, optimalSplit, RETRAIT_PLAN } from '@/lib/fees';
import { keyboardFor } from '@/lib/keyboard';

export default function FeesScreen() {
  const [raw, setRaw] = useState('');
  const amountText = raw.replace(/[^0-9]/g, '');
  const amount = amountText === '' ? NaN : Number(amountText);

  const error =
    amountText !== '' && !isValidAmount(amount, RETRAIT_PLAN)
      ? `Saisissez un montant de ${formatAr(RETRAIT_PLAN.minAmount)} à ${formatAr(RETRAIT_PLAN.maxAmount)}`
      : undefined;

  const result = useMemo(() => {
    if (amountText === '' || error != null) return undefined;
    return optimalSplit(amount, RETRAIT_PLAN);
  }, [amountText, amount, error]);

  const updatedAt = RETRAIT_PLAN.updatedAt.split('-').reverse().join('/');

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ gap: 16, padding: 16 }}>
      <Input
        label="Montant à retirer"
        keyboardType={keyboardFor('amount')}
        value={amountText}
        onChangeText={setRaw}
        placeholder="Ex : 101 000"
        error={error}
      />

      {amountText === '' ? (
        <Text className="text-sm text-muted-foreground">
          Saisissez un montant : le découpage le plus économique s'affiche automatiquement.
        </Text>
      ) : (
        result != null && (
          <>
            <Card>
              <CardTitle>Retrait unique</CardTitle>
              <Text className="mt-1 text-sm text-muted-foreground">
                {formatAr(amount)} → frais de {formatAr(result.singleFee)}
              </Text>
            </Card>

            <Card>
              <CardTitle>Découpage optimal</CardTitle>
              {result.pieces.length === 1 && result.savings === 0 ? (
                <Text className="mt-1 text-sm text-muted-foreground">
                  Un seul retrait : c'est déjà le plus économique.
                </Text>
              ) : (
                <>
                  {result.pieces.map((piece, index) => (
                    <View key={index} className="mt-1 flex-row items-center justify-between gap-2">
                      <Text className="text-sm text-foreground">
                        Retrait {index + 1} : {formatAr(piece.amount)}
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