import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { extractVariables } from '@/lib/parseCode';
import { generateId, saveCode } from '@/storage/storage';
import type { UssdCode } from '@/types';

interface CodeFormProps {
  initial?: UssdCode;
}

const USSD_HINT = 'Utilisez {NOM} pour marquer les variables. Ex: #1*4*1*{NUMERO}*{MONTANT}#';

export function CodeForm({ initial }: CodeFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [code, setCode] = useState(initial?.code ?? '');
  const [nameError, setNameError] = useState<string | undefined>();
  const [codeError, setCodeError] = useState<string | undefined>();

  const variables = extractVariables(code);

  const handleSave = () => {
    const nextName = name.trim();
    const nextCode = code.trim();
    setNameError(nextName ? undefined : 'Le nom est requis');
    setCodeError(nextCode ? undefined : 'La formule est requise');
    if (!nextName || !nextCode) return;

    const now = Date.now();
    const record: UssdCode = {
      id: initial?.id ?? generateId(),
      name: nextName,
      code: nextCode,
      variables,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    };
    saveCode(record);
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4 pb-12" automaticallyAdjustKeyboardInsets>
      <Input label="Nom" value={name} onChangeText={setName} placeholder="Ex: MVola Retrait" error={nameError} />
      <Input
        label="Code USSD"
        value={code}
        onChangeText={setCode}
        placeholder="#1*4*1*{NUMERO}*{MONTANT}#"
        error={codeError}
        hint={USSD_HINT}
        autoCapitalize="characters"
        autoCorrect={false}
        multiline
      />
      {variables.length > 0 && (
        <View className="rounded-lg border border-border bg-card p-4">
          <Text className="mb-2 text-sm font-semibold text-foreground">Variables détectées</Text>
          {variables.map((variable) => (
            <View key={variable.name} className="flex-row items-center justify-between py-1">
              <Text className="font-mono text-sm text-foreground">{"{"}{variable.name}{"}"}</Text>
              <Text className="text-xs capitalize text-muted-foreground">{variable.type}</Text>
            </View>
          ))}
        </View>
      )}
      <Button title={initial ? 'Mettre à jour' : 'Sauvegarder'} onPress={handleSave} />
    </ScrollView>
  );
}