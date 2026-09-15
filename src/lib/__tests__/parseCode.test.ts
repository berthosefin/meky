import { extractVariables, substitute } from '../parseCode';

describe('extractVariables', () => {
  it('detects unique variables in order of first appearance', () => {
    const variables = extractVariables('#1*4*1*{NUMERO}*{MONTANT}#');
    expect(variables.map((v) => v.name)).toEqual(['NUMERO', 'MONTANT']);
  });

  it('ignores duplicate variables', () => {
    const variables = extractVariables('#1*{X}*2*{X}*{Y}#');
    expect(variables.map((v) => v.name)).toEqual(['X', 'Y']);
  });

  it('returns no variables when the formula has none', () => {
    expect(extractVariables('#100#')).toEqual([]);
  });

  it('infers amount type for named amount variables', () => {
    const variables = extractVariables('#1*{MONTANT}#');
    expect(variables[0].type).toBe('amount');
    expect(variables[0].placeholder).toBe('Ex: 5000');
  });

  it('infers phone type for named phone variables', () => {
    const variables = extractVariables('#1*{NUMERO}#');
    expect(variables[0].type).toBe('phone');
    expect(variables[0].placeholder).toBe('Ex: 0340000000');
  });

  it('defaults to text type otherwise', () => {
    const variables = extractVariables('#1*{CODE}#');
    expect(variables[0].type).toBe('text');
  });

  it('trims whitespace inside braces', () => {
    const variables = extractVariables('#1*{ NUMERO }#');
    expect(variables[0].name).toBe('NUMERO');
  });
});

describe('substitute', () => {
  it('replaces variables with provided values', () => {
    const result = substitute('#1*4*1*{NUMERO}*{MONTANT}#', {
      NUMERO: '0340000000',
      MONTANT: '5000',
    });
    expect(result).toBe('#1*4*1*0340000000*5000#');
  });

  it('keeps {NAME} for missing empty values', () => {
    const result = substitute('#1*{NUMERO}*{MONTANT}#', { MONTANT: '5000' });
    expect(result).toBe('#1*{NUMERO}*5000#');
  });

  it('replaces repeated variables with the same value', () => {
    const result = substitute('#1*{X}*2*{X}#', { X: 'A' });
    expect(result).toBe('#1*A*2*A#');
  });

  it('trims surrounding whitespace of substituted values', () => {
    const result = substitute('#1*{X}#', { X: '  42  ' });
    expect(result).toBe('#1*42#');
  });
});