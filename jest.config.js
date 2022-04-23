/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
