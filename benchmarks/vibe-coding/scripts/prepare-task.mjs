import { cp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const [taskId, destination] = process.argv.slice(2);
if (!taskId || !destination) {
  throw new Error("usage: node prepare-task.mjs <task-id> <destination>");
}

const benchmarkRoot = path.resolve(import.meta.dirname, "..");
const fixtureId = taskId === "workflow-spec-audit-export" ? "plan-audit-export" : taskId;
const fixtureRoot = path.join(benchmarkRoot, "fixtures", fixtureId);
const base = path.join(fixtureRoot, "base");
const candidate = path.join(fixtureRoot, "candidate");

await rm(destination, { force: true, recursive: true });
await mkdir(destination, { recursive: true });
await cp(base, destination, { recursive: true });

run("git", ["init", "--quiet"], destination);
run("git", ["config", "user.name", "Codex Benchmark"], destination);
run("git", ["config", "user.email", "benchmark@example.invalid"], destination);
run("git", ["add", "."], destination);
run("git", ["commit", "--quiet", "-m", "fixture baseline"], destination);

try {
  await cp(candidate, destination, { recursive: true, force: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr}`);
  }
}
