# LEONA by DLG Labs

Controlled public benchmark and transparency kit for autonomous code repair.

This repository is intentionally a public release surface, not the complete private product. It contains benchmark evidence, a public dashboard, telemetry schemas, a lightweight orchestration shell, a terminal viewer, the synthetic benchmark framework, and a clearly separated true-LLM repair validation snapshot.

## What Is Included

- `dashboard/` - static public benchmark dashboard with embedded repair telemetry.
- `benchmark-framework/` - procedurally varied benchmark generator and validator.
- `telemetry/` - public telemetry field contract and validation notes.
- `tui/` - lightweight local terminal viewer for benchmark summaries.
- `orchestration-shell/` - simple command wrappers for evidence validation.
- `evidence/` - raw benchmark reports and JSON result artifacts.
- `docs/` - technical brief and public/private release boundary.

## What Stays Private

- Advanced orchestration internals.
- Multi-board routing implementation.
- Repair heuristics and policy tuning.
- Provider routing and enterprise control paths.
- Local write authority and execution chokepoints.
- Secrets, private configs, and unpublished roadmap controls.

## Evidence Summary

- Controlled synthetic benchmark: 1,000/1,000 passing repair cases.
- Real OSS deterministic mutation-replay attempts: 5/5 passing attempts.
- True LLM OSS mutation-repair validation: 1/5 passing attempts with 4/5 retained as `MODEL_LIMITATION`.
- Unauthorized mutation attempts: 0.
- Controlled test-file modifications: 0.
- Controlled rollback events: 5.

## Claim Boundary

The controlled 1,000-case benchmark and deterministic OSS replay evidence validate the harness, mutation boundaries, rollback discipline, diffs, commits, and telemetry pipeline.

The true-LLM validation is separate. It measures model-generated diagnosis and patch creation without known-answer repair replay. Current public evidence shows the pipeline works and fails closed, but the local model snapshot is not yet a high-success autonomous repair result.

## Quick Start

Open the dashboard:

```powershell
start .\dashboard\index.html
```

Validate the bundled evidence:

```powershell
node .\tools\validate_public_evidence.js
```

Render a terminal summary:

```powershell
node .\tools\render_summary.js
python .\tui\leona_tui.py --limit 5
```

Open the lightweight landing page:

```powershell
start .\index.html
```

Read the public benchmark excerpts:

```powershell
start .\docs\benchmark-report-excerpts.html
```

## Evidence Integrity Note

Some raw evidence files include legacy local provenance strings from the private development environment. Those strings are preserved so the evidence remains traceable. They do not include the private core implementation.

## License

See `LICENSE.md`. This controlled release is source-available for review unless DLG Labs publishes a separate open-source license.
