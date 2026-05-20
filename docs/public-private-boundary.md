# Public / Private Boundary

LEONA by DLG Labs is being released in controlled layers. This repository is the public transparency layer.

## Public In This Repo

| Area | Public Content |
|---|---|
| Benchmark evidence | Controlled 1,000-case deterministic replay results, OSS replay attempt results, true LLM validation snapshot, reports, and dashboard data |
| Benchmark framework | Synthetic micro-repo generation and deterministic validation harness |
| True LLM repair evidence | Public telemetry snapshot showing model-generated patch attempts, patch rejections, rollbacks, and honest model-limitation classifications |
| Telemetry | Public result fields, summaries, retry counts, rollback counts, and diff traces |
| Dashboard | Static benchmark dashboard suitable for GitHub Pages or local review |
| TUI | Lightweight terminal viewer for public evidence |
| Orchestration shell | Thin wrappers that validate and summarize public evidence |

## Private For Now

| Area | Reason |
|---|---|
| Advanced orchestration | Product differentiation and stability risk |
| Board routing | Core architecture and future enterprise policy layer |
| Repair heuristics | High-leverage implementation detail |
| Full repair-generation pipeline internals | Product differentiation while the autonomous repair layer matures |
| Provider routing | Operational and commercial sensitivity |
| Local write authority | Security-sensitive execution path |
| Enterprise controls | Future product surface |

## Release Principle

Publish enough to make the benchmark inspectable and credible. Keep enough private that LEONA remains defensible as a product.
