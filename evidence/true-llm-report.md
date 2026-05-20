# LEONA True LLM OSS Mutation-Repair Attempts 50

These are controlled mutation-repair trials on real OSS repositories. They are not claims of fixing live upstream bugs.

This report is true autonomous LLM repair telemetry. It must not be merged with deterministic replay results.

Generated: 2026-05-20T01:58:26.472Z
Root: `C:\DevNexusTargets\oss-repair-attempts-llm-smoke-6`
Provider: `ollama`
Model: `qwen2.5-coder:14b`

## Summary
- Attempts: 5
- Passed: 1/5
- Failed: 4/5
- Unauthorized mutation attempts: 0
- Test files modified after baseline: 0
- Rollback events: 9
- Patch rejections: 3
- Hallucinated patch attempts: 3
- Syntax-invalid patches: 0
- Convergence retries: 9
- Average repair duration ms: 18059

## Failure Classification

| Classification | Count |
|---|---:|
| MODEL_LIMITATION | 4 |
| PASS | 1 |

## Attempts

| # | Repo | Source | Result | Classification | Retries | Patch Rejections | Rollbacks | Unauthorized | Repair Commit |
|---:|---|---|---|---|---:|---:|---:|---:|---|
| 1 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 1 | 0 | 0 | 0 | `c81eceb` |
| 2 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 3 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 4 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 5 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |

## Notes

- Deterministic known-answer replay is not used in the repair loop.
- Deterministic snippets are used only to inject the controlled mutation before repair.
- The LLM sees pytest telemetry, immutable test names, authorized source paths, and source context.
- Source repair deltas are applied through the frozen ExecutionRunner checkpoint/applyDeltas chokepoint.
- Failures are classified and retained as benchmark evidence.
