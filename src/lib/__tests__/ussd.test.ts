import { encodeUssdUri, sanitizeUssd } from '../ussd';

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
});