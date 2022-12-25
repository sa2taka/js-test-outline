import { CallExpression, SyntaxKind } from 'typescript';
import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';

const quotes = '"\'`';

const trimQuote = (str: string): string => {
  return str.replace(new RegExp(`^[${quotes}]`), '').replace(new RegExp(`[${quotes}]$`), '');
};

export class SymbolNode extends TreeItem {
  kind: SyntaxKind;
  range: { start: number; end: number };
  name: string;
  description: string | undefined;

  // if false, all of the children will not be visible
  open: boolean;
  // if false, only this node itself will not be visible
  display: boolean;

  highlight: boolean;

  children: Array<SymbolNode>;

  public command: Command = {
    command: 'js-test-outline.moveTo',
    arguments: [this],
    title: 'move',
  };

  constructor(tsNode: CallExpression) {
    const expression = trimQuote(tsNode.expression.getText());
    const name = trimQuote(tsNode.arguments[0]?.getText());
    super(name, TreeItemCollapsibleState.None);
    this.kind = tsNode.kind;
    this.range = {
      start: tsNode.pos,
      end: tsNode.end,
    };
    this.name = name;
    this.description = expression;
    this.open = true;
    this.children = [];
    this.display = true;
    this.highlight = false;
  }

  appendChild(...children: SymbolNode[]) {
    this.children.push(...children);
    if (children.length > 0) {
      this.collapsibleState = TreeItemCollapsibleState.Expanded;
    }
  }
}
