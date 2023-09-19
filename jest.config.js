/** @type {import('ts-jest).JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageThreshold: {
        global: 90
    },
    collectCoverageFrom: [
        "src/**/*.ts"
    ],
    coveragePathIgnorePatterns: [
        "node_modules",
        "log.ts",
        "__mocks__",
        "commands"
    ]
}