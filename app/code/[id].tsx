import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { CodeForm } from '@/components/code-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { keyboardFor } from '@/lib/keyboard';
import { substitute } from '@/lib/parseCode';
import { launchUssd } from '@/lib/ussd';
import { deleteCode, getCode } from '@/storage/storage';
import type { UssdCode } from '@/types';

export default function CodeScreen() {
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();
  const router = useRouter();
  const [code] = useState<UssdCode | undefined>(() => getCode(id));

  if (!code) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-base font-semibold text-foreground">Code introuvable</Text>
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  if (edit === '1') {
    return <CodeForm initial={code} />;
  }

  return <ExecuteView code={code} />;
}

function ExecuteView({ code }: { code: UssdCode }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [missing, setMissing] = useState<string[]>([]);

  const preview = substitute(code.code, values);

  const handleExecute = async () => {
    const empty = code.variables.filter((variable) => !values[variable.name]?.trim()).map((variable) => variable.name);
    setMissing(empty);
    if (empty.length > 0) return;
    try {
      await launchUssd(code.code);
    } catch (error) {
      Alert.alert('Impossible de lancer le code', error instanceof Error ? error.message : 'Erreur inconnue');
    }
  };

  const confirmDelete = () => {
    Alert.alert('Supprimer', `Supprimer "${code.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          deleteCode(code.id);
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ gap: 16, padding: 16 }} automaticallyAdjustKeyboardInsets>
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-foreground">{code.name}</Text>
        <View className="flex-row gap-4">
          <Pressable onPress={() => router.push(`/code/${code.id}?edit=1`)} hitSlop={8}>
            <Ionicons name="create-outline" size={22} color="rgb(var(--muted-foreground))" />
          </Pressable>
          <Pressable onPress={confirmDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={22} color="rgb(var(--destructive))" />
          </Pressable>
        </View>
      </View>

      {code.variables.map((variable) => {
        const isMissing = missing.includes(variable.name);
        return (
          <Input
            key={variable.name}
            label={'{'.concat(variable.name, '}')}
            value={values[variable.name] ?? ''}
            onChangeText={(text) => setValues((prev) => ({ ...prev, [variable.name]: text }))}
            placeholder={variable.placeholder}
            keyboardType={keyboardFor(variable.type)}
            error={isMissing ? 'Valeur requise' : undefined}
          />
        );
      })}

      {code.variables.length === 0 && (
        <Text className="text-sm text-muted-foreground">Aucune variable à remplir.</Text>
      )}

      <View className="rounded-lg border border-border bg-card p-4">
        <Text className="mb-1.5 text-xs font-medium text-muted-foreground">APERÇU</Text>
        <Text className="font-mono text-sm text-foreground">{preview}</Text>
      </View>

      <Button title="Exécuter l'USSD" onPress={handleExecute} />
    </ScrollView>
  );
}