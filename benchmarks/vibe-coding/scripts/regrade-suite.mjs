import { execFileSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [resultRootArgument] = process.argv.slice(2);
if (!resultRootArgument) {
  throw new Error("usage: node regrade-suite.mjs <result-root>");
}

const benchmarkRoot = path.resolve(import.meta.dirname, "..");
const resultRoot = path.resolve(resultRootArgument);
const suite = path.basename(resultRoot);
const benchHome = requiredEnv("CODEX_BENCH_HOME");
const metadataFiles = await findFiles(resultRoot, "metadata.json");
const results = [];

for (const metadataFile of metadataFiles) {
  const metadata = JSON.parse(await readFile(metadataFile, "utf8"));
  const resultDirectory = path.dirname(metadataFile);
  const workspace = path.join(
    benchHome,
    "runs",
    suite,
    metadata.variant,
    metadata.taskId,
    `run-${metadata.repetition}`,
  );
  const trace = path.join(resultDirectory, "trace.jsonl");
  const output = execFileSync(
    process.execPath,
    [path.join(benchmarkRoot, "scripts", "grade-task.mjs"), metadata.taskId, workspace, trace],
    { encoding: "utf8" },
  );
  const grade = JSON.parse(output);
  metadata.score = grade.score;
  await writeFile(path.join(resultDirectory, "grade.json"), `${JSON.stringify(grade, null, 2)}\n`, "utf8");
  await writeFile(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
  results.push(metadata);
}

await writeFile(path.join(resultRoot, "summary.json"), `${JSON.stringify(results, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ regraded: results.length, resultRoot }, null, 2)}\n`);

async function findFiles(root, name) {
  const found = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) found.push(...(await findFiles(entryPath, name)));
    else if (entry.name === name) found.push(entryPath);
  }
  return found;
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return path.resolve(value);
}
