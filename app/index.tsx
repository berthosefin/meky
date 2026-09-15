import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';

import { Card, CardTitle, CodePreview } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { deleteCode, listCodes } from '@/storage/storage';
import type { UssdCode } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const [codes, setCodes] = useState<UssdCode[]>([]);

  useFocusEffect(
    useCallback(() => {
      setCodes(listCodes());
    }, [])
  );

  const confirmDelete = (code: UssdCode) => {
    Alert.alert('Supprimer', `Supprimer "${code.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          deleteCode(code.id);
          setCodes(listCodes());
        },
      },
    ]);
  };

  const openCode = (id: string) => router.push(`/code/${id}`);

  if (codes.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          title="Aucun code enregistré"
          description="Ajoutez votre premier code USSD pour le retrouver facilement."
          actionLabel="Ajouter un code"
          onAction={() => router.push('/code/new')}
        />
        <Fab onPress={() => router.push('/code/new')} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={codes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 8, padding: 16, paddingBottom: 96 }}
        renderItem={({ item }) => (
          <Card onPress={() => openCode(item.id)} onLongPress={() => confirmDelete(item)}>
            <View className="flex-row items-center justify-between">
              <CardTitle>{item.name}</CardTitle>
              <View className="flex-row gap-4">
                <Pressable onPress={() => router.push(`/code/${item.id}?edit=1`)} hitSlop={8}>
                  <Ionicons name="create-outline" size={20} color="rgb(var(--muted-foreground))" />
                </Pressable>
                <Pressable onPress={() => confirmDelete(item)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={20} color="rgb(var(--muted-foreground))" />
                </Pressable>
              </View>
            </View>
            <CodePreview>{item.code}</CodePreview>
          </Card>
        )}
      />
      <Fab onPress={() => router.push('/code/new')} />
    </View>
  );
}

function Fab({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
      android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
    >
      <Text className="text-3xl leading-none text-primary-foreground">+</Text>
    </Pressable>
  );
}