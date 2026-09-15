import { useColorScheme } from 'react-native';

export function useIconColor(foreground = true): string {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  if (foreground) return dark ? '#d4d4d8' : '#71717a'; // muted-foreground
  return dark ? '#f8fafc' : '#18181b'; // default foreground
}