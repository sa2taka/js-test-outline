import { commands, ExtensionContext, Position, window, Selection } from 'vscode';
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

  const treeView = window.createTreeView('js-test-outline-view', {
    treeDataProvider: provider,
  });

  treeView.onDidExpandElement(async (event) => {
    if (!window.activeTextEditor) {
      return;
    }
    window.activeTextEditor.selection = new Selection(
      event.element.range.start.line,
      0,
      event.element.range.start.line,
      0
    );

    await commands.executeCommand('editor.unfold');
  });

  treeView.onDidCollapseElement(async (event) => {
    if (!window.activeTextEditor) {
      return;
    }
    window.activeTextEditor.selection = new Selection(
      event.element.range.start.line,
      0,
      event.element.range.start.line,
      0
    );

    await commands.executeCommand('editor.fold');
  });

  commands.registerCommand('js-test-outline.moveTo', (symbolNode: SymbolNode) => {
    const start = new Position(symbolNode.range.start.line, symbolNode.range.start.character);
    commands.executeCommand(
      'editor.action.goToLocations',
      window.activeTextEditor?.document.uri,
      start,
      [],
      'goto',
      ''
    );
  });
};

export function deactivate(): Thenable<void> | undefined {
  return undefined;
}
