# Telemetry Layer

The public telemetry layer records benchmark outcomes without exposing private repair heuristics.

Core fields:

- `total`
- `passed`
- `failed`
- `convergenceSuccess`
- `retryDistribution`
- `unauthorizedMutationAttempts`
- `rollbackEvents`
- `testFilesModified`
- `averageRepairDurationMs`
- `categories`
- `cases`
- `repoTraces`

Use `schema.json` for the public shape and `tools/validate_public_evidence.js` for sanity checks.
