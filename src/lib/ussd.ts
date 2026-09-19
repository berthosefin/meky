import * as IntentLauncher from 'expo-intent-launcher';
import { Linking } from 'react-native';

export function sanitizeUssd(code: string): string {
  return code.replace(/[^0-9A-Za-z*#]/g, '');
}

export function encodeUssdUri(code: string): string {
  const clean = sanitizeUssd(code);
  let encoded = '';
  for (const char of clean) {
    if (char === '#') encoded += '%23';
    else if (char === '*') encoded += '%2A';
    else encoded += char;
  }
  return `tel:${encoded}`;
}

/**
 * Launches the USSD code in the system dialer.
 *
 * On Android, `Linking.canOpenURL('tel:...')` can wrongly report false
 * (Android 11+ intent verification), so we fire the `ACTION_DIAL` intent
 * directly with expo-intent-launcher, and fall back to `Linking.openURL`.
 */
export async function launchUssd(code: string): Promise<void> {
  const url = encodeUssdUri(code);

  try {
    await IntentLauncher.startActivityAsync('android.intent.action.DIAL', {
      data: url,
    });
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Ignore "activity not found" style errors and fall back to Linking below.
    if (!/activity.*not found|no activity/i.test(message)) {
      throw new Error(
        "Impossible d'ouvrir le dialer. Vérifiez qu'une application Téléphone est installée."
      );
    }
  }

  try {
    await Linking.openURL(url);
  } catch {
    throw new Error(
      "Impossible d'ouvrir le dialer. Vérifiez qu'une application Téléphone est installée."
    );
  }
}