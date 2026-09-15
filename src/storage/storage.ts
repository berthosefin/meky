import { MMKV } from 'react-native-mmkv';

import type { UssdCode } from '../types';

const storage = new MMKV({ id: 'meky' });
const CODES_KEY = 'ussd.codes';

function readAll(): UssdCode[] {
  const raw = storage.getString(CODES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(codes: UssdCode[]): void {
  storage.set(CODES_KEY, JSON.stringify(codes));
}

export function listCodes(): UssdCode[] {
  return readAll().sort((a, b) => a.createdAt - b.createdAt);
}

export function getCode(id: string): UssdCode | undefined {
  return readAll().find((code) => code.id === id);
}

export function saveCode(code: UssdCode): void {
  const codes = readAll();
  const index = codes.findIndex((item) => item.id === code.id);
  if (index >= 0) {
    codes[index] = code;
  } else {
    codes.push(code);
  }
  writeAll(codes);
}

export function deleteCode(id: string): void {
  writeAll(readAll().filter((code) => code.id !== id));
}

export function generateId(): string {
  let id: string;
  do {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  } while (getCode(id));
  return id;
}