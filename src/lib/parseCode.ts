import type { Variable, VariableType } from '../types';

const VARIABLE_PATTERN = /\{([^{}]+)\}/g;

export function extractVariables(code: string): Variable[] {
  const names: string[] = [];
  const seen = new Set<string>();
  const matches = code.matchAll(VARIABLE_PATTERN);
  for (const match of matches) {
    const name = match[1].trim();
    if (name && !seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
  }
  return names.map((name) => ({ name, type: inferType(name), placeholder: defaultPlaceholder(name) }));
}

export function inferType(name: string): VariableType {
  return /MONTANT|PRIX|TAUX|SOMME|FRAIS|SOLDE/i.test(name)
    ? 'amount'
    : /NUMERO|TELEPHONE|PHONE|TEL|NUMBER/i.test(name)
      ? 'phone'
      : 'text';
}

export function defaultPlaceholder(name: string): string {
  switch (inferType(name)) {
    case 'amount':
      return 'Ex: 5000';
    case 'phone':
      return 'Ex: 0340000000';
    default:
      return '';
  }
}

export function substitute(code: string, values: Record<string, string>): string {
  return code.replace(VARIABLE_PATTERN, (match, key: string) => {
    const value = values[key.trim()];
    return value && value.trim() !== '' ? value.trim() : match;
  });
}