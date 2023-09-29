import { isCallExpression, Node, SourceFile } from 'typescript';
import { SymbolNode } from './symbol-node';
import { isGroup, isTest } from './symbol-type';

export const visitTestNode = (node: Node, sourceFile: SourceFile): SymbolNode[] => {
  const childTestSymbols: SymbolNode[] = [];
  node.forEachChild((child) => {
    if (isCallExpression(child)) {
      const currentSymbolNode = new SymbolNode(child, sourceFile);

      if (!isGroup(currentSymbolNode.description ?? '') && !isTest(currentSymbolNode.description ?? '')) {
        childTestSymbols.push(...visitTestNode(child, sourceFile));
        return;
      }

      if (isGroup(currentSymbolNode.description ?? '')) {
        const children = visitTestNode(child, sourceFile);
        currentSymbolNode.appendChild(...children);
      }

      childTestSymbols.push(currentSymbolNode);
    } else {
      const result = visitTestNode(child, sourceFile);
      if (result.length > 0) {
        childTestSymbols.push(...result);
      }
    }
  });

  return childTestSymbols;
};
