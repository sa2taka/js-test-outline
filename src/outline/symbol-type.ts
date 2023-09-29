import { getGroupNames, getTestNames } from '../config';

export type SymbolType = 'group' | 'test';

export const isGroup = (name: string): boolean => {
  return getGroupNames().some((group) => new RegExp(`^${group}(\\.|$)`).test(name));
};

export const isTest = (name: string): boolean => {
  return getTestNames().some((test) => new RegExp(`^${test}(\\.|$)`).test(name));
};
