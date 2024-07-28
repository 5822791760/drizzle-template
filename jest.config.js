/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: ['<rootDir>'],
  collectCoverageFrom: [
    'src/modules/**/*.controller.ts',
    'src/modules/**/*.service.ts',
    'src/modules/**/*.usecase.ts',
    'src/modules/**/*.repo.ts',
  ],
  coveragePathIgnorePatterns: ['src/modules/drizzle'],
};
