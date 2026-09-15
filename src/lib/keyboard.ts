import type { KeyboardTypeOptions } from 'react-native';

import type { VariableType } from '../types';

const KEYBOARD_BY_TYPE: Record<VariableType, KeyboardTypeOptions> = {
  phone: 'phone-pad',
  amount: 'numeric',
  text: 'default',
};

export function keyboardFor(type: VariableType): KeyboardTypeOptions {
  return KEYBOARD_BY_TYPE[type];
}