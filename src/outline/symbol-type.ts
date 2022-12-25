export type SymbolType = 'group' | 'test';

export const isGroup = (name: string, groups: string[]): boolean => {
  return groups.some((group) => new RegExp(`^${group}(\\.|$)`).test(name));
};

export const isTest = (name: string, tests: string[]): boolean => {
  return tests.some((test) => new RegExp(`^${test}(\\.|$)`).test(name));
};
