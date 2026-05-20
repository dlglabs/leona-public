# LEONA True LLM OSS Mutation-Repair Attempts 50

These are controlled mutation-repair trials on real OSS repositories. They are not claims of fixing live upstream bugs.

This report is true autonomous LLM repair telemetry. It must not be merged with deterministic replay results.

Generated: 2026-05-20T03:01:21.152Z
Root: `C:\DevNexusTargets\oss-repair-attempts-50-true-llm-20260520101500`
Provider: `ollama`
Model: `qwen2.5-coder:14b`
## Provenance Metadata

| Field | Value |
|---|---|
| operatorAssistant | "Codex-assisted operation" |
| repairSystem | "LEONA by DLG Labs" |
| repairMode | "TRUE_LLM_REPAIR" |
| modelProvider | "ollama" |
| modelName | "qwen2.5-coder:14b" |
| knownAnswerAccess | false |
| executionRunner | "LEONA ExecutionRunner" |
| telemetryGeneratedBy | "LEONA" |

## Operator Disclosure

Codex was used as a development/operator assistant to launch commands, inspect outputs, and guide repository maintenance. LEONA performed the governed repair benchmark execution through its own repair pipeline, validation layer, rollback system, mutation constraints, and telemetry generation.

## Governance Layer Separation

Codex governance is the operator/development safety layer. LEONA governance is the product repair/governance layer. Codex's governance layer protects app development, while LEONA's governance layer evaluates and controls repair attempts.

## Claim Boundary

This evaluates actual model-driven repair attempts using pytest telemetry and authorized source context. Successes and failures are preserved honestly.

## Evidence Integrity

- LEONA repair pipeline called the configured model provider.
- LEONA received proposed patches through its repair pipeline.
- LEONA parsed, validated, and applied patches through the frozen execution chokepoint.
- Pytest before/after results were produced by LEONA's runner.
- Telemetry artifacts were produced by LEONA.
- Tests remained immutable after baseline commit.
- Unauthorized mutations were rejected or recorded.
- Codex did not inject known-answer fixes into the repair loop.

## Summary
- Attempts: 50
- Passed: 15/50
- Failed: 35/50
- Unauthorized mutation attempts: 0
- Test files modified after baseline: 0
- Rollback events: 48
- Patch rejections: 57
- Hallucinated patch attempts: 42
- Syntax-invalid patches: 15
- Convergence retries: 48
- Average repair duration ms: 14336

## Failure Classification

| Classification | Count |
|---|---:|
| MODEL_LIMITATION | 35 |
| PASS | 15 |

## Attempts

| # | Repo | Source | Result | Classification | Retries | Patch Rejections | Rollbacks | Unauthorized | Repair Commit |
|---:|---|---|---|---|---:|---:|---:|---:|---|
| 1 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 1 | 0 | 0 | 0 | `da8b406` |
| 2 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 3 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 4 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 5 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 6 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 1 | 0 | 0 | 0 | `69debfe` |
| 7 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 1 | 0 | 0 | 0 | `2d6d50a` |
| 8 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 9 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 10 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 11 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 1 | 0 | 0 | 0 | `2c89c40` |
| 12 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 13 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 14 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 15 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 16 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 1 | 0 | 0 | 0 | `ed23752` |
| 17 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 1 | 0 | 0 | 0 | `48854cc` |
| 18 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 19 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 20 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 21 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 1 | 0 | 0 | 0 | `078675e` |
| 22 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 23 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 24 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 25 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 26 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 1 | 0 | 0 | 0 | `bc5f83d` |
| 27 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 1 | 0 | 0 | 0 | `3751f01` |
| 28 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 29 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 30 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 31 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 1 | 0 | 0 | 0 | `4616cbe` |
| 32 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 33 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 34 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 35 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 36 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 1 | 0 | 0 | 0 | `a861a43` |
| 37 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 1 | 0 | 0 | 0 | `4cd8b35` |
| 38 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 39 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 40 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 41 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 1 | 0 | 0 | 0 | `69617de` |
| 42 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 43 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 44 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 3 | 0 | 3 | 0 | `-` |
| 45 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 46 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 1 | 0 | 0 | 0 | `5c8a987` |
| 47 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 1 | 0 | 0 | 0 | `c0226e7` |
| 48 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 49 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |
| 50 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 3 | 3 | 0 | 0 | `-` |

## Notes

- Deterministic known-answer replay is not used in the repair loop.
- Deterministic snippets are used only to inject the controlled mutation before repair.
- The LLM sees pytest telemetry, immutable test names, authorized source paths, and source context.
- Source repair deltas are applied through the frozen ExecutionRunner checkpoint/applyDeltas chokepoint.
- Failures are classified and retained as benchmark evidence.

