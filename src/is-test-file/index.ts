import path = require('path');

const isJsFile = (filePath: string, jsExtension: string[]): boolean => {
  const extension = path.parse(filePath).ext.replace('.', '');
  return jsExtension.includes(extension);
};

const isInTestDirectory = (filePath: string, testRoots: string[]): boolean => {
  const sep = path.sep;
  return testRoots.some((root) => {
    const regexp = new RegExp(`[${sep}^]${root}[${sep}$]`);
    return regexp.test(filePath);
  });
};

export type Config = {
  jsExtensions: string[];
  testSuffix: string;
  testRoots: string[];
};
export const isTestFile = (filePath: string, { jsExtensions, testSuffix, testRoots }: Config): boolean => {
  if (!isJsFile(filePath, jsExtensions)) {
    return false;
  }

  const fileName = path.parse(filePath).name;
  if (fileName.match(new RegExp(`${testSuffix}$`))) {
    return true;
  }

  return isInTestDirectory(filePath, testRoots);
};
