# LEONA Benchmark Report Excerpts

These excerpts are curated from the raw controlled benchmark and OSS mutation-repair reports included in `evidence/`. They are intended for public review without exposing private orchestration, board routing, or repair heuristics.

## Operator Disclosure

Codex was used as a development/operator assistant to launch commands, inspect outputs, and guide repository maintenance. LEONA performed the governed repair benchmark execution through its own repair pipeline, validation layer, rollback system, mutation constraints, and telemetry generation.

## Governance Layer Separation

- Codex governance = operator/development safety layer.
- LEONA governance = product repair/governance layer.

Codex's governance layer protects app development, while LEONA's governance layer evaluates and controls repair attempts.

## Controlled 1,000-Case Repair Benchmark

LEONA by DLG Labs completed a controlled 1,000-case autonomous repair benchmark across procedurally varied Python micro-repositories.

| Metric | Result |
|---|---:|
| Cases | 1,000 |
| Passed | 1,000 |
| Failed | 0 |
| Convergence success | 1,000 |
| Unauthorized mutation attempts | 0 |
| Test files modified | 0 |
| Rollback events | 5 |
| Average repair duration | 931 ms |

## Retry Distribution

| Retry Count | Cases |
|---:|---:|
| 1 | 995 |
| 2 | 5 |

## Coverage Families

The controlled benchmark covered 30 repair families, including arithmetic guards, statistics edge cases, parsing, validation, normalization, matrix transforms, class method contracts, cart and pricing logic, auth parsing, CSV quote handling, and limited multi-file failures involving helper modules, import mismatches, constants drift, and shared interface contracts.

## Deterministic OSS Mutation-Replay Attempts

LEONA also completed five real open-source micro-repository mutation-replay attempts. These are not claims of upstream defects; they are controlled mutation-repair probes run against real project structures.

| Repository | Result | Repair Commit |
|---|---:|---|
| toolz | PASS | `3ce6870` |
| tqdm | PASS | `4489056` |
| python-sortedcontainers | PASS | `25d0f9c` |
| cachetools | PASS | `6ded9bf` |
| boltons | PASS | `377f584` |

## True LLM Repair Validation

LEONA now has a separate true LLM repair path. In this mode, the model receives pytest telemetry and authorized source context, but it does not receive known fixed answers. Proposed patches are parsed, validated, applied through the frozen execution runner, and retried only within the configured attempt limit.

| Metric | Result |
|---|---:|
| Cases | 50 |
| Passed | 15 |
| Failed | 35 |
| Unauthorized mutation attempts | 0 |
| Test files modified | 0 |
| Patch rejections | 57 |
| Hallucinated patch attempts | 42 |
| Syntax-invalid patch count | 15 |
| Rollback events | 48 |
| Final model-limitation classifications | 35 |

## Evidence Integrity Requirements

Valid LEONA repair evidence requires that LEONA's repair pipeline called the model provider, received proposed patches through its repair pipeline, parsed and validated patches, applied patches through the governed execution path, produced pytest before/after results, generated telemetry artifacts, preserved immutable tests, and rejected or recorded unauthorized mutations. Codex did not inject known-answer fixes into the repair loop.

## Claim Boundary

For deterministic replay:

> This validates the benchmark harness, mutation boundaries, rollback system, telemetry, and evidence pipeline. It does not prove unknown-bug autonomous reasoning.

For true LLM repair:

> This evaluates actual model-driven repair attempts using pytest telemetry and authorized source context. Successes and failures are preserved honestly.

## Public Interpretation

The public evidence demonstrates that the repair workflow can repeatedly preserve immutable tests, apply scoped source changes, verify passing tests, record rollback events, and produce Git-traceable diffs across a large synthetic corpus plus a small deterministic OSS mutation-replay sample.

The true LLM evidence demonstrates that the autonomous repair pipeline is active and governed, but it should not be blended with the deterministic replay success rate.

The private product layer remains separate. This public release does not include advanced orchestration internals, board routing, repair heuristics, provider routing, local write authority controls, or enterprise policy systems.
