#!/usr/bin/env python
"""Tiny terminal viewer for LEONA public benchmark evidence."""

import argparse
import json
from pathlib import Path


def load_data():
    root = Path(__file__).resolve().parents[1]
    with (root / "dashboard" / "dashboard-data.json").open("r", encoding="utf-8") as handle:
        return json.load(handle)


def print_row(label, value):
    print(f"{label:<34} {value}")


def main():
    parser = argparse.ArgumentParser(description="View LEONA public benchmark telemetry.")
    parser.add_argument("--limit", type=int, default=10, help="Number of sample cases to display.")
    args = parser.parse_args()

    data = load_data()
    controlled = data["controlled"]
    oss = data["oss"]

    print("LEONA by DLG Labs")
    print("=" * 52)
    print_row("Controlled benchmark", f"{controlled['passed']}/{controlled['total']} passed")
    print_row("Convergence success", f"{controlled['convergenceSuccess']}/{controlled['total']}")
    print_row("Unauthorized mutations", controlled["unauthorizedMutationAttempts"])
    print_row("Test files modified", controlled["testFilesModified"])
    print_row("Rollback events", controlled["rollbackEvents"])
    print_row("Average repair duration", f"{controlled['averageRepairDurationMs']} ms")
    print_row("OSS attempts", f"{oss['passed']}/{oss['total']} passed")

    print("\nSample controlled cases")
    print("-" * 52)
    for case in (controlled.get("cases") or [])[: max(0, args.limit)]:
        name = case.get("name", "unknown")
        category = case.get("category", "unknown")
        retries = case.get("retryCount", "?")
        changed = ", ".join(case.get("filesChanged", [])) or "none"
        print(f"{name} | {category} | retries={retries} | changed={changed}")


if __name__ == "__main__":
    main()
