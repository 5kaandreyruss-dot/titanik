// Test-only stub for the "server-only" marker package, aliased in
// vitest.config.ts so modules that import it can be unit-tested with plain
// Node (they are never actually bundled for a client in tests).
export {};
