# LEONA by DLG Labs

Controlled public benchmark and transparency kit for autonomous code repair.

This repository is intentionally a public release surface, not the complete private product. It contains benchmark evidence, a public dashboard, telemetry schemas, a lightweight orchestration shell, a terminal viewer, and the synthetic benchmark framework needed to inspect or reproduce the public repair benchmark.

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
- Real OSS mutation-repair attempts: 5/5 passing attempts.
- Unauthorized mutation attempts: 0.
- Controlled test-file modifications: 0.
- Controlled rollback events: 5.

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

## Evidence Integrity Note

Some raw evidence files include legacy local provenance strings from the private development environment. Those strings are preserved so the evidence remains traceable. They do not include the private core implementation.

## License

See `LICENSE.md`. This controlled release is source-available for review unless DLG Labs publishes a separate open-source license.
