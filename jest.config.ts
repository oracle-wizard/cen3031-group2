// jest.config.ts
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  };