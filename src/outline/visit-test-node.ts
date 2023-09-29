import { Node, isCallExpression, SourceFile } from 'typescript';
import { SymbolNode } from './symbol-node';
import { isGroup, isTest } from './symbol-type';

export type Config = {
  groupNames: string[];
  testNames: string[];
  syncExpand: boolean;
  enableExpandLeaf: boolean;
};

export const visitTestNode = (node: Node, config: Config, sourceFile: SourceFile): SymbolNode[] => {
  const childTestSymbols: SymbolNode[] = [];
  node.forEachChild((child) => {
    if (isCallExpression(child)) {
      const currentSymbolNode = new SymbolNode(child, config, sourceFile);

      if (
        !isGroup(currentSymbolNode.description ?? '', config.groupNames) &&
        !isTest(currentSymbolNode.description ?? '', config.testNames)
      ) {
        childTestSymbols.push(...visitTestNode(child, config, sourceFile));
        return;
      }

      if (isGroup(currentSymbolNode.description ?? '', config.groupNames)) {
        const children = visitTestNode(child, config, sourceFile);
        currentSymbolNode.appendChild(...children);
      }

      childTestSymbols.push(currentSymbolNode);
    } else {
      const result = visitTestNode(child, config, sourceFile);
      if (result.length > 0) {
        childTestSymbols.push(...result);
      }
    }
  });

  return childTestSymbols;
};
