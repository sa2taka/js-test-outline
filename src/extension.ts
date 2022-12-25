import { commands, ExtensionContext, window } from 'vscode';
import { getActiveWorkspace, getGroupNames, getTestNames } from './config';
import { OutlineProvider } from './outline/outline-provider';
import { SymbolNode } from './outline/symbol-node';

export const activate = async (context: ExtensionContext) => {
  const workspace = getActiveWorkspace();
  if (!workspace) {
    window.showErrorMessage('Workspace is not activated');
    return;
  }

  const outlineProviderConfig = {
    groupNames: getGroupNames(),
    testNames: getTestNames(),
  };
  const provider = new OutlineProvider(context, outlineProviderConfig);

  window.registerTreeDataProvider('js-test-outline-view', provider);

  commands.registerCommand('js-test-outline.moveTo', (symbolNode: SymbolNode) => {
    console.log(symbolNode);
  });
};

export function deactivate(): Thenable<void> | undefined {
  return undefined;
}
