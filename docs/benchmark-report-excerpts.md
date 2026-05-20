# LEONA Benchmark Report Excerpts

These excerpts are curated from the raw controlled benchmark and OSS mutation-repair reports included in `evidence/`. They are intended for public review without exposing private orchestration, board routing, or repair heuristics.

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
| Cases | 5 |
| Passed | 1 |
| Failed | 4 |
| Unauthorized mutation attempts | 0 |
| Test files modified | 0 |
| Patch rejections | 3 |
| Hallucinated patch attempts | 3 |
| Rollback events | 9 |
| Final model-limitation classifications | 4 |

## Public Interpretation

The public evidence demonstrates that the repair workflow can repeatedly preserve immutable tests, apply scoped source changes, verify passing tests, record rollback events, and produce Git-traceable diffs across a large synthetic corpus plus a small deterministic OSS mutation-replay sample.

The true LLM evidence demonstrates that the autonomous repair pipeline is active and governed, but it should not be blended with the deterministic replay success rate.

The private product layer remains separate. This public release does not include advanced orchestration internals, board routing, repair heuristics, provider routing, local write authority controls, or enterprise policy systems.
