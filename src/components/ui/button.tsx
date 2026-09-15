import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  disabled?: boolean;
  children?: ReactNode;
}

const VARIANTS = {
  default: {
    container: 'bg-primary',
    text: 'text-primary-foreground',
  },
  destructive: {
    container: 'bg-destructive',
    text: 'text-destructive-foreground',
  },
  outline: {
    container: 'border border-input',
    text: 'text-foreground',
  },
  ghost: {
    container: '',
    text: 'text-foreground',
  },
} as const;

export function Button({ title, onPress, variant = 'default', disabled, children }: ButtonProps) {
  const variantClass = VARIANTS[variant];
  const showLabel = children == null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: 'rgba(127,127,127,0.2)' }}
      className={`h-11 flex-row items-center justify-center gap-2 rounded-md px-4 ${variantClass.container} ${
        disabled ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {children}
      {showLabel && <Text className={`text-base font-medium ${variantClass.text}`}>{title}</Text>}
    </Pressable>
  );
}