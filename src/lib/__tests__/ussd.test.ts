import * as IntentLauncher from 'expo-intent-launcher';
import { Linking } from 'react-native';

import { encodeUssdUri, launchUssd, sanitizeUssd } from '../ussd';

const DIAL = 'android.intent.action.DIAL';

describe('sanitizeUssd', () => {
  it('keeps digits, stars, hashes and letters', () => {
    expect(sanitizeUssd('#1*4*1*0340000000*5000#')).toBe('#1*4*1*0340000000*5000#');
  });

  it('drops unexpected characters such as spaces', () => {
    expect(sanitizeUssd('#1*CODE * 5#')).toBe('#1*CODE*5#');
  });
});

describe('encodeUssdUri', () => {
  it('encodes hashes and stars into a tel: URI', () => {
    expect(encodeUssdUri('#1*4*1*0340000000*5000#')).toBe(
      'tel:%231%2A4%2A1%2A0340000000%2A5000%23'
    );
  });

  it('returns tel: with digits untouched', () => {
    expect(encodeUssdUri('100')).toBe('tel:100');
  });

  it('encodes a substituted formula with variables resolved', () => {
    expect(encodeUssdUri('#1*4*1*0340000000*5000#')).toBe(
      'tel:%231%2A4%2A1%2A0340000000%2A5000%23'
    );
  });
});

describe('launchUssd', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fires the ACTION_DIAL intent with the encoded tel: URI', async () => {
    const startActivitySpy = jest
      .spyOn(IntentLauncher, 'startActivityAsync')
      .mockResolvedValue({} as IntentLauncher.IntentLauncherResult);
    const openURLSpy = jest.spyOn(Linking, 'openURL');

    await launchUssd('#1*4*1*0340000000*5000#');

    expect(startActivitySpy).toHaveBeenCalledWith(DIAL, {
      data: 'tel:%231%2A4%2A1%2A0340000000%2A5000%23',
    });
    expect(openURLSpy).not.toHaveBeenCalled();
  });

  it('falls back to Linking.openURL when the dialer intent is not found', async () => {
    jest
      .spyOn(IntentLauncher, 'startActivityAsync')
      .mockRejectedValue(new Error('android.intent.action.DIAL: no activity found'));
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

    await launchUssd('#100#');

    expect(openURLSpy).toHaveBeenCalled();
  });

  it('throws an explicit message when opening fails entirely', async () => {
    jest
      .spyOn(IntentLauncher, 'startActivityAsync')
      .mockRejectedValue(new Error('android.intent.action.DIAL: no activity found'));
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('boom'));

    await expect(launchUssd('#100#')).rejects.toThrow(
      "Impossible d'ouvrir le dialer. Vérifiez qu'une application Téléphone est installée."
    );
  });

  it('throws an explicit message on unexpected intent errors', async () => {
    jest.spyOn(IntentLauncher, 'startActivityAsync').mockRejectedValue(new Error('weird error'));

    await expect(launchUssd('#100#')).rejects.toThrow(
      "Impossible d'ouvrir le dialer. Vérifiez qu'une application Téléphone est installée."
    );
  });
});