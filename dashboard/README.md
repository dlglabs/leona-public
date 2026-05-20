# LEONA by DLG Labs Public Benchmark Dashboard

Open `index.html` in a browser or publish this folder as static hosting.

## Included Evidence

- Controlled benchmark: 1000/1000 passed
- Real OSS attempts: 5/5 passed
- Adaptive true LLM validation: 23/50 passed
- Unauthorized mutation attempts: 0
- True LLM unauthorized mutation attempts: 0
- True LLM patch rejections: 217
- Controlled rollback events: 5

## Claim Boundary

The controlled 1,000-case benchmark and OSS replay benchmark are deterministic mutation-replay evidence. The True LLM tab is separate autonomous model-generated repair evidence and should not be merged into the deterministic success rate.

For deterministic replay: This validates the benchmark harness, mutation boundaries, rollback system, telemetry, and evidence pipeline. It does not prove unknown-bug autonomous reasoning.

For true LLM repair: This evaluates actual model-driven repair attempts using pytest telemetry and authorized source context. Successes and failures are preserved honestly.

## Operator Disclosure

Codex was used as a development/operator assistant to launch commands, inspect outputs, and guide repository maintenance. LEONA performed the governed repair benchmark execution through its own repair pipeline, validation layer, rollback system, mutation constraints, and telemetry generation.

## Evidence Integrity

- LEONA repair pipeline called the model provider.
- LEONA generated or received proposed patches through its repair pipeline.
- LEONA parsed, validated, and applied patches.
- Pytest before/after results were produced by LEONA's runner.
- Telemetry artifacts were produced by LEONA.
- Tests remained immutable.
- Unauthorized mutations were rejected or recorded.
- Codex did not inject known-answer fixes into the repair loop.

## Source Artifacts

- Controlled results: `C:\DevNexusTargets\saved-benchmarks\devnexus-repair-bench-1000-20260520070004\artifact-backup\results.json`
- Controlled report: `C:\DevNexusTargets\saved-benchmarks\devnexus-repair-bench-1000-20260520070004\artifact-backup\benchmark-report.md`
- OSS results: `C:\DevNexusTargets\oss-repair-attempts-20260520073500\oss-attempt-results\results.json`
- OSS report: `C:\DevNexusTargets\oss-repair-attempts-20260520073500\oss-attempt-results\benchmark-report.md`
- True LLM results: `C:\DevNexusTargets\oss-repair-attempts-50-adaptive-true-llm-20260520115521\oss-attempt-results\results.json`
- True LLM report: `C:\DevNexusTargets\oss-repair-attempts-50-adaptive-true-llm-20260520115521\oss-attempt-results\benchmark-report.md`
