import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'meky' }} />
        <Stack.Screen name="code/new" options={{ title: 'Nouveau code' }} />
        <Stack.Screen name="code/[id]" options={{ title: 'Exécuter' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}