import { Node, isCallExpression } from 'typescript';
import { SymbolNode } from './symbol-node';
import { isGroup, isTest } from './symbol-type';

export type Config = {
  groupNames: string[];
  testNames: string[];
};

export const visitTestNode = (node: Node, config: Config): SymbolNode[] => {
  const childTestSymbols: SymbolNode[] = [];
  node.forEachChild((child) => {
    if (isCallExpression(child)) {
      const currentSymbolNode = new SymbolNode(child, config);

      if (
        !isGroup(currentSymbolNode.description ?? '', config.groupNames) &&
        !isTest(currentSymbolNode.description ?? '', config.testNames)
      ) {
        childTestSymbols.push(...visitTestNode(child, config));
        return;
      }

      const children = visitTestNode(child, config);
      currentSymbolNode.appendChild(...children);
      childTestSymbols.push(currentSymbolNode);
    } else {
      const result = visitTestNode(child, config);
      if (result.length > 0) {
        childTestSymbols.push(...result);
      }
    }
  });

  return childTestSymbols;
};
