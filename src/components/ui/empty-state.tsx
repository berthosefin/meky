import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Ionicons name="reader-outline" size={28} color="rgb(var(--muted-foreground))" />
      </View>
      <Text className="text-center text-base font-semibold text-foreground">{title}</Text>
      <Text className="text-center text-sm text-muted-foreground">{description}</Text>
      {actionLabel && <Button title={actionLabel} onPress={onAction} />}
    </View>
  );
}