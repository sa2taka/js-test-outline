import {
  Event,
  EventEmitter,
  ExtensionContext,
  ProviderResult,
  TextDocument,
  TreeDataProvider,
  TreeItem,
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
  context: ExtensionContext;
  lastSelectedLine: number | undefined;
  roots: SymbolNode[] | undefined;

  constructor(context: ExtensionContext, private config: OutlineProviderConfig) {
    this.context = context;

    this.#initEventListeners();
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
      const textDocument = window.activeTextEditor?.document || event?.document;
      if (textDocument) {
        this.#buildView(textDocument);
      } else {
        this.roots = [];
      }

      this.refresh();
    }, this);

    // edit
    workspace.onDidChangeTextDocument(async (event) => {
      this.#buildView(window.activeTextEditor?.document || event.document);
      this.refresh();
    });

    if (window.activeTextEditor) {
      this.#buildView(window.activeTextEditor.document);
    }
  }

  async #buildView(textDocument: TextDocument): Promise<void> {
    const compileConfig = this.#getCompileConfig(textDocument);
    if (!compileConfig) {
      this.roots = [];
      return;
    }
    const sourceFile = compile(textDocument.getText(), compileConfig);

    const tree: SymbolNode[] = visitTestNode(sourceFile, this.config, sourceFile);

    this.roots = tree;
  }

  #getCompileConfig(textDocument: TextDocument): { isJs: boolean; isReact: boolean } | undefined {
    switch (textDocument.languageId) {
      case 'javascriptreact':
        return { isJs: true, isReact: true };
      case 'javascript':
        return { isJs: true, isReact: false };
      case 'typescriptreact':
        return { isJs: false, isReact: true };
      case 'typescript':
        return { isJs: false, isReact: false };
    }
    return undefined;
  }

  private _onDidChangeTreeData: EventEmitter<SymbolNode | undefined | null | void> = new EventEmitter<
    SymbolNode | undefined | null | void
  >();
  readonly onDidChangeTreeData: Event<SymbolNode | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
