import { Linking } from 'react-native';

import { encodeUssdUri, launchUssd, sanitizeUssd } from '../ussd';

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

  it('opens the dialer with the encoded tel: URI when supported', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

    await launchUssd('#1*4*1*0340000000*5000#');

    expect(openURLSpy).toHaveBeenCalledWith('tel:%231%2A4%2A1%2A0340000000%2A5000%23');
  });

  it('throws an explicit message when no dialer can handle the URI', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);

    await expect(launchUssd('#100#')).rejects.toThrow(
      "Aucun dialer disponible. Vérifiez qu'une application Téléphone est installée."
    );
  });

  it('throws an explicit message when opening the URI fails', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('boom'));

    await expect(launchUssd('#100#')).rejects.toThrow(
      "Impossible d'ouvrir le dialer. Vérifiez qu'une application Téléphone est installée."
    );
  });
});