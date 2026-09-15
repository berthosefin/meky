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

export async function launchUssd(code: string): Promise<void> {
  const url = encodeUssdUri(code);
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error('Aucun dialer disponible pour lancer ce code USSD.');
  }
  await Linking.openURL(url);
}