# LEONA True LLM OSS Mutation-Repair Attempts 50

These are controlled mutation-repair trials on real OSS repositories. They are not claims of fixing live upstream bugs.

This report is true autonomous LLM repair telemetry. It must not be merged with deterministic replay results.

Generated: 2026-05-20T04:30:12.077Z
Root: `C:\DevNexusTargets\oss-repair-attempts-50-adaptive-true-llm-20260520115521`
Provider: `ollama`
Model: `local-14b-code-model`
Adaptive retries: enabled (9 max attempts)

## Public Model Labeling

Public benchmark artifacts use generalized model labels such as `local-14b-code-model`. Exact internal model IDs, provider tuning notes, and private model comparison telemetry remain private unless DLG Labs separately approves their release.

## Provenance Metadata

| Field | Value |
|---|---|
| operatorAssistant | "Codex-assisted operation" |
| repairSystem | "LEONA by DLG Labs" |
| repairMode | "TRUE_LLM_REPAIR" |
| modelProvider | "ollama" |
| modelName | "local-14b-code-model" |
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
- Passed: 23/50
- Failed: 27/50
- Unauthorized mutation attempts: 0
- Test files modified after baseline: 0
- Rollback events: 98
- Patch rejections: 217
- Repeated patch rejections: 162
- Hallucinated patch attempts: 45
- Syntax-invalid patches: 9
- Convergence retries: 98
- Average repair duration ms: 41802

## Failure Classification

| Classification | Count |
|---|---:|
| MODEL_LIMITATION | 27 |
| PASS | 23 |

## Attempts

| # | Repo | Source | Result | Classification | Retries | Patch Rejections | Rollbacks | Unauthorized | Repair Commit |
|---:|---|---|---|---|---:|---:|---:|---:|---|
| 1 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 2 | 0 | 1 | 0 | `ee02f04` |
| 2 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 9 | 6 | 2 | 0 | `c6d7563` |
| 3 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 4 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 4 | 5 | 0 | `-` |
| 5 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 6 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 2 | 0 | 1 | 0 | `22679b4` |
| 7 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 9 | 5 | 4 | 0 | `-` |
| 8 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 8 | 7 | 0 | 0 | `9500384` |
| 9 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 9 | 6 | 3 | 0 | `-` |
| 10 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | PASS | PASS | 4 | 2 | 1 | 0 | `2ad1404` |
| 11 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 2 | 0 | 1 | 0 | `86754b9` |
| 12 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 2 | 1 | 0 | 0 | `29c4f3f` |
| 13 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 14 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 5 | 4 | 0 | `-` |
| 15 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 9 | 8 | 1 | 0 | `-` |
| 16 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 2 | 0 | 1 | 0 | `8e3f935` |
| 17 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 18 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 8 | 6 | 1 | 0 | `ebe1b8a` |
| 19 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 20 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | PASS | PASS | 4 | 2 | 1 | 0 | `478a75f` |
| 21 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 2 | 0 | 1 | 0 | `dc4f29f` |
| 22 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 8 | 5 | 2 | 0 | `e815a3f` |
| 23 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 24 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 5 | 4 | 0 | `-` |
| 25 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 26 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 2 | 1 | 0 | 0 | `db1540b` |
| 27 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 9 | 5 | 4 | 0 | `-` |
| 28 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 9 | 8 | 1 | 0 | `-` |
| 29 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 30 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | PASS | PASS | 4 | 2 | 1 | 0 | `7d305ca` |
| 31 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 2 | 0 | 1 | 0 | `0a9af39` |
| 32 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 8 | 5 | 2 | 0 | `8020ac6` |
| 33 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 34 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 5 | 4 | 0 | `-` |
| 35 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 36 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 2 | 1 | 0 | 0 | `d6037e1` |
| 37 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 9 | 4 | 5 | 0 | `-` |
| 38 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 2 | 0 | 1 | 0 | `fe2fec4` |
| 39 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 9 | 6 | 3 | 0 | `-` |
| 40 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 41 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 2 | 0 | 1 | 0 | `3b7abdf` |
| 42 | [toolz](https://github.com/pytoolz/toolz) | `toolz/itertoolz.py` | PASS | PASS | 5 | 2 | 2 | 0 | `a0ab03a` |
| 43 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 44 | [tqdm](https://github.com/tqdm/tqdm) | `tqdm/utils.py` | FAIL | MODEL_LIMITATION | 9 | 6 | 3 | 0 | `-` |
| 45 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | FAIL | MODEL_LIMITATION | 9 | 7 | 2 | 0 | `-` |
| 46 | [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src/sortedcontainers/sortedlist.py` | PASS | PASS | 2 | 0 | 1 | 0 | `63ccb46` |
| 47 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | FAIL | MODEL_LIMITATION | 9 | 4 | 5 | 0 | `-` |
| 48 | [cachetools](https://github.com/tkem/cachetools) | `src/cachetools/__init__.py` | PASS | PASS | 9 | 7 | 1 | 0 | `8047511` |
| 49 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | FAIL | MODEL_LIMITATION | 9 | 6 | 3 | 0 | `-` |
| 50 | [boltons](https://github.com/mahmoud/boltons) | `boltons/iterutils.py` | PASS | PASS | 4 | 2 | 1 | 0 | `fc2b202` |

## Notes

- Deterministic known-answer replay is not used in the repair loop.
- Deterministic snippets are used only to inject the controlled mutation before repair.
- The LLM sees pytest telemetry, immutable test names, authorized source paths, and source context.
- Source repair deltas are applied through the frozen ExecutionRunner checkpoint/applyDeltas chokepoint.
- Failures are classified and retained as benchmark evidence.

