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

export function getActiveWorkspace(): vscode.WorkspaceFolder | undefined {
  const currentFileUri = vscode.window.activeTextEditor?.document.uri;

  return currentFileUri ? vscode.workspace.getWorkspaceFolder(currentFileUri) : undefined;
}

export const getGroupNames = (): string[] => {
  return vscode.workspace.getConfiguration('js-test-outline').get('groupNames')!;
};

export const getTestNames = (): string[] => {
  return vscode.workspace.getConfiguration('js-test-outline').get('testNames')!;
};

export const getSyncExpand = (): boolean => {
  return vscode.workspace.getConfiguration('js-test-outline').get('syncExpand') ?? true;
};

export const getEnableExpandLeaf = (): boolean => {
  return vscode.workspace.getConfiguration('js-test-outline').get('enableExpandLeaf') ?? true;
};

export const getSyncSelection = ():boolean => {
  return vscode.workspace.getConfiguration('js-test-outline').get('syncSelection') ?? true;
}
