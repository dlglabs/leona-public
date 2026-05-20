"use strict";

const path = require("path");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function main() {
  const dataPath = path.join(__dirname, "..", "dashboard", "dashboard-data.json");
  const data = require(dataPath);
  const controlled = data.controlled || {};
  const oss = data.oss || {};
  const llm = data.llm || {};

  if (controlled.total === 1000) pass("controlled total is 1000");
  else fail(`controlled total expected 1000, got ${controlled.total}`);

  if (controlled.passed === 1000 && controlled.failed === 0) pass("controlled benchmark is 1000/1000");
  else fail(`controlled pass/fail mismatch: ${controlled.passed}/${controlled.total}, failed=${controlled.failed}`);

  if (controlled.convergenceSuccess === 1000) pass("controlled convergence success is 1000/1000");
  else fail(`convergence success expected 1000, got ${controlled.convergenceSuccess}`);

  if (controlled.unauthorizedMutationAttempts === 0) pass("controlled unauthorized mutations are zero");
  else fail(`unauthorized mutations expected 0, got ${controlled.unauthorizedMutationAttempts}`);

  if (controlled.testFilesModified === 0) pass("controlled test-file modifications are zero");
  else fail(`test-file modifications expected 0, got ${controlled.testFilesModified}`);

  if (controlled.rollbackEvents === 5) pass("controlled rollback events are recorded as 5");
  else fail(`rollback events expected 5, got ${controlled.rollbackEvents}`);

  if (oss.total === 5 && oss.passed === 5 && oss.failed === 0) pass("OSS mutation-repair attempts are 5/5");
  else fail(`OSS pass/fail mismatch: ${oss.passed}/${oss.total}, failed=${oss.failed}`);

  if (llm.repairMode === "true-llm") pass("true LLM validation is labeled separately");
  else fail(`true LLM repairMode expected true-llm, got ${llm.repairMode}`);

  if (llm.total === 5 && llm.passed === 1 && llm.failed === 4) pass("true LLM validation snapshot is 1/5 with 4 retained failures");
  else fail(`true LLM pass/fail mismatch: ${llm.passed}/${llm.total}, failed=${llm.failed}`);

  if (llm.unauthorizedMutationAttempts === 0 && llm.testFilesModified === 0) pass("true LLM boundaries held");
  else fail(`true LLM boundary mismatch: unauthorized=${llm.unauthorizedMutationAttempts}, tests=${llm.testFilesModified}`);

  if (!process.exitCode) {
    console.log("LEONA public evidence validation complete.");
  }
}

main();
