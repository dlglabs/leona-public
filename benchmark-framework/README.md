# Benchmark Framework

`run_bench1000.js` generates procedurally varied Python repair scenarios and validates the repair contract.

The framework emphasizes semantic diversity:

- Symbol, file, function, class, and variable renaming.
- Numeric, string, array, null, empty, ordering, and boundary mutation.
- Fault location scrambling.
- Single-file and limited multi-file repair cases.
- Immutable tests and authorized-file repair constraints.
- Git diff and commit evidence per successful repair.

This is the public synthetic benchmark harness. It is not the private LEONA repair engine, board routing system, or advanced orchestration layer.

## Example

```powershell
node .\run_bench1000.js --count 20 --root C:\DevNexusTargets\leona-public-smoke
```

The default output root is under `C:\DevNexusTargets` to keep generated repositories outside this release package.
