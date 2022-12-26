import { CallExpression, SyntaxKind } from 'typescript';
import { Command, ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { OutlineProviderConfig } from './outline-provider';
import { isGroup } from './symbol-type';

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

  public iconPath: ThemeIcon | undefined = undefined;

  public get color() {
    return new ThemeColor('symbolIcon.functionForeground');
  }

  constructor(tsNode: CallExpression, private config: OutlineProviderConfig) {
    const expression = trimQuote(tsNode.expression.getText());
    const name = trimQuote(tsNode.arguments[0]?.getText());
    super(
      name,
      isGroup(expression, config.groupNames) ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None
    );

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
    this.iconPath = this.#suggestIcon();
  }

  appendChild(...children: SymbolNode[]) {
    this.children.push(...children);
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
    if (isGroup(this.description ?? '', this.config.groupNames)) {
      return new ThemeIcon('symbol-function');
    }
    return new ThemeIcon('symbol-value');
  }
}
