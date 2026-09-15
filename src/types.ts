export type VariableType = 'phone' | 'amount' | 'text';

export interface Variable {
  name: string;
  type: VariableType;
  placeholder: string;
}

export interface UssdCode {
  id: string;
  name: string;
  code: string;
  variables: Variable[];
  createdAt: number;
  updatedAt: number;
}