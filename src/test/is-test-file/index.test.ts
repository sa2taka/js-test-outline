import { isTestFile } from '../../is-test-file';

describe('isInTest', () => {
  const jsExtensions = ['js', 'ts', 'jsx', 'tsx'];
  const testRoots = ['__tests__'];
  const testSuffix = '.test';

  describe("when test root is '__tests__'", () => {
    ['__tests__/src/index.ts', 'src/__tests__/index.jsx'].forEach((path) => {
      it(`should return true for ${path}`, () => {
        expect(isTestFile(path, { jsExtensions, testRoots, testSuffix })).toBeTruthy();
      });
    });

    ['src/index.ts', 'src/tests/index.jsx'].forEach((path) => {
      it(`should return false for ${path}`, () => {
        expect(isTestFile(path, { jsExtensions, testRoots, testSuffix })).toBeFalsy();
      });
    });
  });
});
