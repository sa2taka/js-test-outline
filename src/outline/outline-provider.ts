import {
  CancellationToken,
  ExtensionContext,
  ProviderResult,
  TextDocument,
  TreeDataProvider,
  TreeItem,
  Uri,
  WebviewView,
  window,
  workspace,
} from 'vscode';
import { compile } from '../typescript/compile';
import { SymbolNode } from './symbol-node';
import { visitTestNode } from './visit-test-node';

export type OutlineProviderConfig = {
  groupNames: string[];
  testNames: string[];
};

export class OutlineProvider implements TreeDataProvider<SymbolNode> {
  viewType = 'outline-map-view';
  context: ExtensionContext;
  outlineRoot: SymbolNode | undefined;
  view: WebviewView | undefined;
  #extensionUri: Uri;
  lastSelectedLine: number | undefined;
  indexes: Map<number, SymbolNode>;
  roots: SymbolNode[] | undefined;

  constructor(context: ExtensionContext, private config: OutlineProviderConfig) {
    this.context = context;
    this.#extensionUri = context.extensionUri;

    this.#initEventListeners();
    this.indexes = new Map<number, SymbolNode>();
  }

  getTreeItem(element: SymbolNode): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: SymbolNode | undefined): ProviderResult<SymbolNode[]> {
    if (element) {
      return element.children;
    }

    if (this.roots) {
      return this.roots;
    }

    return [];
  }

  #initEventListeners() {
    // switch tabs
    window.onDidChangeActiveTextEditor((event) => {
      // TODO
    }, this);

    // scroll
    window.onDidChangeTextEditorVisibleRanges((event) => {
      // TODO
    });

    window.onDidChangeTextEditorSelection((event) => {
      // TODO
    });

    // edit
    workspace.onDidChangeTextDocument(async (event) => {
      this.#buildView(window.activeTextEditor?.document || event.document);
    });

    if (window.activeTextEditor) {
      this.#buildView(window.activeTextEditor.document);
    }
  }

  async #buildView(textDocument: TextDocument): Promise<void> {
    const sourceFile = compile(textDocument.getText());

    const tree: SymbolNode[] = visitTestNode(sourceFile, this.config);

    this.roots = tree;
  }
}
