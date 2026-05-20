"use strict";

const path = require("path");

function line(label, value) {
  console.log(`${label.padEnd(34)} ${value}`);
}

function main() {
  const data = require(path.join(__dirname, "..", "dashboard", "dashboard-data.json"));
  const controlled = data.controlled;
  const oss = data.oss;

  console.log("LEONA by DLG Labs - Public Benchmark Summary");
  console.log("=".repeat(52));
  line("Generated", data.generatedAt);
  line("Controlled benchmark", `${controlled.passed}/${controlled.total} passed`);
  line("Convergence success", `${controlled.convergenceSuccess}/${controlled.total}`);
  line("Unauthorized mutations", controlled.unauthorizedMutationAttempts);
  line("Test files modified", controlled.testFilesModified);
  line("Rollback events", controlled.rollbackEvents);
  line("Average repair duration", `${controlled.averageRepairDurationMs} ms`);
  line("OSS mutation-repair attempts", `${oss.passed}/${oss.total} passed`);
  console.log("");
  console.log("Retry distribution:");
  for (const item of controlled.retryDistribution || []) {
    console.log(`  retry ${item.retryCount}: ${item.count} cases`);
  }
}

main();
