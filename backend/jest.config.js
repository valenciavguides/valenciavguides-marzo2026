/**
 * Test configuration for Jest
 */

module.exports = {
    testEnvironment: 'node',
    verbose: true,
    roots: ['<rootDir>', '<rootDir>/../tests'],
    modulePaths: ['<rootDir>', '<rootDir>/node_modules'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '^\\.\\.\/server$': '<rootDir>/server.js'
    },
    collectCoverageFrom: [
        'routes/**/*.js',
        'services/**/*.js',
        'middleware/**/*.js',
        'utils/**/*.js',
        '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: ['<rootDir>/../tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/../tests/setup.js'],
    testTimeout: 10000
};
