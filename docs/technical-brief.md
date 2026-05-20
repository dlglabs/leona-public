# LEONA by DLG Labs: 1,000-Case Autonomous Repair Benchmark Technical Brief

## Executive Summary

LEONA by DLG Labs completed a controlled 1,000-case autonomous repair benchmark designed to test deterministic repair discipline across procedurally varied Python micro-repositories. The final corrected run achieved **1,000/1,000 passing cases**, with **0 test-file modifications**, **0 unauthorized mutation attempts**, and **1,000/1,000 convergence success**. The benchmark was archived with raw telemetry and a human-readable report for repeatable review.

## Benchmark Design

Each generated repository began in a deliberately broken state and was initialized as an independent Git repository. The harness enforced the same repair contract for every case: pytest must fail before repair, tests must remain immutable, only authorized source files may change, pytest must pass after repair, and every successful repair must produce a diff plus commit. The suite used semantic variation rather than cosmetic cloning, including randomized symbols, file names, class names, helper names, numeric boundaries, array contents, string values, edge cases, fault locations, and multi-file repair scopes touching up to three files.

## Coverage Profile

The suite covered 30 repair families, including arithmetic guards, statistics edge cases, parsing, validation, normalization, matrix transforms, class method contracts, cart/pricing logic, auth parsing, CSV quote handling, and multi-file failures involving helper modules, import mismatches, constants drift, and shared interface contracts. Category counts were distributed across the full 1,000 cases, with each family passing all generated instances.

## Final Metrics

- Final benchmark root: `C:\DevNexusTargets\devnexus-repair-bench-1000-20260520070004`
- Seed: `devnexus-full-1000-v1`
- Cases: **1,000**
- Passed: **1,000/1,000**
- Convergence success: **1,000/1,000**
- Unauthorized mutation attempts: **0**
- Test files modified: **0**
- Rollback events: **5**
- Average repair duration: **931 ms**
- Evidence artifacts: `benchmark-report.md`, `results.json`, archived ZIP, and SHA-256 manifests.

## Interpretation

This benchmark proves the controlled repair workflow can repeatedly diagnose failing tests, apply scoped source changes, preserve tests, verify success, and commit repairs across a broad synthetic micro-repo corpus. It is strong internal evidence for the repair harness and discipline gates. The next proof tier is external validity: five real open-source micro-repository repair attempts using the same evidence rules, clearly labeled separately from the controlled synthetic benchmark.
