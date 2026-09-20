import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: dark ? '#09090B' : '#FAFAFA' },
          headerTintColor: dark ? '#FAFAFA' : '#18181B',
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          headerTitle: 'Meky',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="fees" options={{ title: 'Frais & économies' }} />
        <Stack.Screen name="code/new" options={{ title: 'Nouveau code' }} />
        <Stack.Screen name="code/[id]" options={{ title: 'Exécuter' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}