import { CallExpression, LineAndCharacter, SourceFile, SyntaxKind } from 'typescript';
import { Command, Position, ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getEnableExpandLeaf } from '../config';
import { isGroup, isTest } from './symbol-type';

const quotes = '"\'`';

const trimQuote = (str: string): string => {
  return str.replace(new RegExp(`^[${quotes}]`), '').replace(new RegExp(`[${quotes}]$`), '');
};

const trimArgsAndBrackets = (callExpressionText: string): string => {
  return callExpressionText.replace(/[<(][\s\S]+$/, '');
};

export class SymbolNode extends TreeItem {
  kind: SyntaxKind;
  range: { start: LineAndCharacter; end: LineAndCharacter };
  name: string;
  description: string | undefined;

  parent: SymbolNode | undefined;
  children: Array<SymbolNode>;

  public command: Command = {
    command: 'js-test-outline.moveTo',
    arguments: [this],
    title: 'move',
  };

  public iconPath: ThemeIcon | undefined = undefined;

  public get color() {
    return new ThemeColor('symbolIcon.functionForeground');
  }

  constructor(tsNode: CallExpression, sourceFile: SourceFile, parent?: SymbolNode) {
    const expression = trimArgsAndBrackets(trimQuote(tsNode.expression.getText()));
    const name = trimQuote(tsNode.arguments[0]?.getText() ?? '');
    super(
      name,
      isTest(expression) && !getEnableExpandLeaf() ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Expanded
    );

    this.kind = tsNode.kind;
    this.range = {
      start: sourceFile.getLineAndCharacterOfPosition(tsNode.getStart()),
      end: sourceFile.getLineAndCharacterOfPosition(tsNode.getEnd()),
    };
    this.name = name;
    this.description = expression;
    this.children = [];
    this.iconPath = this.#suggestIcon();
    this.parent = parent;
  }

  appendChild(...children: SymbolNode[]) {
    this.children.push(...children);
  }

  findChildNearlyPosition(position: Position): SymbolNode | undefined {
    if (!this.hasPosition(position)) {
      return undefined;
    }

    const nearlyChild = this.children
      .map((child) => child.findChildNearlyPosition(position))
      .filter((s): s is SymbolNode => Boolean(s))[0];

    return nearlyChild ?? this;
  }

  hasPosition(position: Position): boolean {
    if (this.range.start.line < position.line && position.line < this.range.end.line) {
      return true;
    }

    if (this.range.start.line === position.line && position.character >= this.range.start.character) {
      return true;
    }

    if (this.range.end.line === position.line && position.character <= this.range.end.character) {
      return true;
    }

    return false;
  }

  #suggestIcon(): ThemeIcon {
    if (this.description?.includes('each')) {
      return new ThemeIcon('symbol-array');
    }
    if (this.description?.includes('skip')) {
      return new ThemeIcon('testing-skipped-icon');
    }
    if (this.description?.includes('todo')) {
      return new ThemeIcon('extensions-configure-recommended');
    }
    if (isGroup(this.description ?? '')) {
      return new ThemeIcon('symbol-function');
    }
    return new ThemeIcon('symbol-value');
  }
}
