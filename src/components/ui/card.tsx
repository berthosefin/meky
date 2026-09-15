import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function Card({ children, className, onPress, onLongPress }: CardProps) {
  const content = (
    <View className={`rounded-lg border border-border bg-card p-4 ${className ?? ''}`}>{children}</View>
  );

  if (onPress || onLongPress) {
    return (
      <Pressable onPress={onPress} onLongPress={onLongPress} android_ripple={{ color: 'rgba(127,127,127,0.15)' }}>
        {content}
      </Pressable>
    );
  }

  return content;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <Text className="text-base font-semibold text-card-foreground">{children}</Text>;
}

export function CodePreview({ children }: { children: ReactNode }) {
  return (
    <View className="mt-1.5 rounded-md bg-muted px-2 py-1">
      <Text className="font-mono text-xs text-muted-foreground">{children}</Text>
    </View>
  );
}