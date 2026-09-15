import type { ReactNode } from 'react';
import { Text } from 'react-native';

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <Text className={`text-xs font-medium text-muted-foreground ${className ?? ''}`}>{children}</Text>;
}