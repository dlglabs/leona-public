# DevNexus Real OSS Micro-Repo Repair Attempts

Generated: 2026-05-20T00:09:03.616Z
Root: `C:\DevNexusTargets\oss-repair-attempts-20260520073500`

## Provenance Metadata

| Field | Value |
|---|---|
| operatorAssistant | "Codex-assisted operation" |
| repairSystem | "LEONA by DLG Labs" |
| repairMode | "DETERMINISTIC_REPLAY" |
| modelProvider | "not applicable" |
| modelName | "not applicable" |
| knownAnswerAccess | "deterministic replay fixture, not true LLM repair" |
| executionRunner | "LEONA ExecutionRunner" |
| telemetryGeneratedBy | "LEONA" |

## Operator Disclosure

Codex was used as a development/operator assistant to launch commands, inspect outputs, and guide repository maintenance. LEONA performed the governed repair benchmark execution through its own validation layer, rollback system, mutation constraints, and telemetry generation.

## Claim Boundary

This validates the benchmark harness, mutation boundaries, rollback system, telemetry, and evidence pipeline. It does not prove unknown-bug autonomous reasoning.

## Summary
- Attempts: 5
- Passed: 5/5
- Test files modified after baseline: 0
- Unauthorized mutation attempts: 0

## Attempts

| Repo | Source | Result | Before | After | Repair Commit |
|---|---|---|---|---|---|
| [toolz](https://github.com/pytoolz/toolz) | `toolz\itertoolz.py` | PASS | 1 failed in 0.04s | 1 passed in 0.01s | `3ce6870` |
| [tqdm](https://github.com/tqdm/tqdm) | `tqdm\utils.py` | PASS | 1 failed, 2 warnings in 0.04s | 1 passed, 2 warnings in 0.01s | `4489056` |
| [python-sortedcontainers](https://github.com/grantjenks/python-sortedcontainers) | `src\sortedcontainers\sortedlist.py` | PASS | 1 failed in 0.04s | 1 passed in 0.02s | `25d0f9c` |
| [cachetools](https://github.com/tkem/cachetools) | `src\cachetools\__init__.py` | PASS | 1 failed in 0.03s | 1 passed in 0.01s | `6ded9bf` |
| [boltons](https://github.com/mahmoud/boltons) | `boltons\iterutils.py` | PASS | 1 failed in 0.06s | 1 passed in 0.02s | `377f584` |
