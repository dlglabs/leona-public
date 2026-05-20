# Evidence Provenance

## Operator Disclosure

Codex was used as a development/operator assistant to launch commands, inspect outputs, and guide repository maintenance. LEONA performed the governed repair benchmark execution through its own repair pipeline, validation layer, rollback system, mutation constraints, and telemetry generation.

## Governance Layer Separation

Codex governance is the operator/development safety layer. It helps protect repository maintenance, command execution, documentation updates, and review of local outputs during development work.

LEONA governance is the product repair/governance layer. It evaluates and controls repair attempts through the LEONA repair pipeline, patch parser, validation layer, rollback system, mutation boundaries, immutable-test checks, and telemetry generation.

Codex's governance layer protects app development. LEONA's governance layer evaluates and controls repair attempts.

## Evidence Integrity Requirements

Valid LEONA repair evidence requires:

- LEONA repair pipeline called the model provider.
- LEONA generated or received proposed patches through its repair pipeline.
- LEONA parsed, validated, and applied patches.
- Pytest before/after results were produced by LEONA's runner.
- Telemetry artifacts were produced by LEONA.
- Tests remained immutable.
- Unauthorized mutations were rejected or recorded.
- Codex did not inject known-answer fixes into the repair loop.

## Reproducibility Direction

The long-term goal is to make the benchmark independently runnable without Codex through commands such as:

```powershell
node run_oss50_llm.js --count 50
```

That one-command path reduces ambiguity for outside reviewers by making LEONA's benchmark execution reproducible without relying on an operator assistant.

## Claim Boundary

For deterministic replay:

> This validates the benchmark harness, mutation boundaries, rollback system, telemetry, and evidence pipeline. It does not prove unknown-bug autonomous reasoning.

For true LLM repair:

> This evaluates actual model-driven repair attempts using pytest telemetry and authorized source context. Successes and failures are preserved honestly.

True LLM repair results are reported separately from deterministic replay results.
