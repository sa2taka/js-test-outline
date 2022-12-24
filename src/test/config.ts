/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as vscode from 'vscode';

export const getTestsRoots = (): string[] => {
  return vscode.workspace.getConfiguration('js-test-outline').get('testSourceRoots')!;
};

export const getTestFileSuffix = (): string => {
  return vscode.workspace.getConfiguration('js-test-outline').get('testFileSuffix')!;
};

export const getExtensionsForTest = (): string[] => {
  return ['ts', 'js', 'tsx', 'jsx', 'mts', 'mjs', 'cts', 'cjs'];
};

export const getIgnorePaths = (): string[] => {
  return ['node_modules'];
};
