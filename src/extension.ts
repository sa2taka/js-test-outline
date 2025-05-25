import { commands, ExtensionContext, Position, window } from 'vscode';
import { getSyncExpand, getSyncSelection } from './config';
import { OutlineProvider } from './outline/outline-provider';
import { SymbolNode } from './outline/symbol-node';

export const activate = async (context: ExtensionContext) => {
  const provider = new OutlineProvider(context);

  const treeView = window.createTreeView('js-test-outline-view', {
    treeDataProvider: provider,
  });

  let prevSelectionLine = -1;

  let isTreeViewFocused = false;

  treeView.onDidChangeVisibility((e) => {
    isTreeViewFocused = e.visible;
  });

  window.onDidChangeTextEditorSelection((e) => {
    if (!getSyncSelection() || !isTreeViewFocused) {
      return;
    }

    const firstSelectionStart = e.selections[0].start;
    // Do not trigger the event when moving within the same line to avoid a bug that occurs when editing test title.
    // It is not common to have multiple tests on the same line in Jest, so it is considered safe.
    if (firstSelectionStart.line === prevSelectionLine) {
      return;
    }
    prevSelectionLine = firstSelectionStart.line;

    const symbolNode = provider.findSymbolNode(firstSelectionStart);

    if (symbolNode) {
      treeView.reveal(symbolNode, { select: true });
    }
  });

  window.onDidChangeActiveTextEditor(() => {
    prevSelectionLine = -1;
  });

  treeView.onDidExpandElement(async (event) => {
    if (!getSyncExpand()) {
      return;
    }
    if (!window.activeTextEditor) {
      return;
    }
    await commands.executeCommand('editor.unfold', {
      levels: 1,
      direction: 'up',
      selectionLines: [event.element.range.start.line],
    });
  });

  treeView.onDidCollapseElement(async (event) => {
    if (!getSyncExpand()) {
      return;
    }
    if (!window.activeTextEditor) {
      return;
    }

    await commands.executeCommand('editor.fold', {
      levels: 1,
      direction: 'up',
      selectionLines: [event.element.range.start.line],
    });
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
