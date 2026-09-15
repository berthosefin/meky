import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { Label } from './label';

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(({ label, hint, error, className, ...props }, ref) => (
  <View className={`gap-1.5 ${className ?? ''}`}>
    {label != null && <Label>{label}</Label>}
    <TextInput
      ref={ref}
      className={`h-11 rounded-md border bg-card px-3 text-base text-foreground ${
        error ? 'border-destructive' : 'border-input'
      }`}
      placeholderTextColor={
        error
          ? 'rgb(var(--destructive))'
          : 'rgb(var(--muted-foreground))'
      }
      {...props}
    />
    {error != null && <Text className="text-xs text-destructive">{error}</Text>}
    {error == null && hint != null && <Text className="text-xs text-muted-foreground">{hint}</Text>}
  </View>
));
Input.displayName = 'Input';