import { createSourceFile, Node, ScriptKind, ScriptTarget, SourceFile } from 'typescript';

export const compile = (code: string, config = { isReact: false, isJs: false }): SourceFile => {
  return createSourceFile('_.ts', code, ScriptTarget.ESNext, true, guessKind(config));
};

const guessKind = (config: { isReact: boolean; isJs: boolean }): ScriptKind => {
  if (config.isReact && config.isJs) {
    return ScriptKind.JSX;
  }

  if (!config.isReact && config.isJs) {
    return ScriptKind.JS;
  }

  if (config.isReact && !config.isJs) {
    return ScriptKind.TSX;
  }

  return ScriptKind.TS;
};
