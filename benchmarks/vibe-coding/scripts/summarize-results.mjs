import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [resultRootArgument] = process.argv.slice(2);
if (!resultRootArgument) {
  throw new Error("usage: node summarize-results.mjs <result-root>");
}

const resultRoot = path.resolve(resultRootArgument);
const metadataFiles = await findFiles(resultRoot, "metadata.json");
const rows = [];

for (const metadataFile of metadataFiles) {
  const metadata = JSON.parse(await readFile(metadataFile, "utf8"));
  const directory = path.dirname(metadataFile);
  const grade = JSON.parse(await readFile(path.join(directory, "grade.json"), "utf8"));
  const trace = await readFile(path.join(directory, "trace.jsonl"), "utf8");
  rows.push({
    ...metadata,
    inputTokens: grade.usage?.input_tokens ?? null,
    outputTokens: grade.usage?.output_tokens ?? null,
    skillEvidence: hasSkillEvidence(metadata.variant, trace),
  });
}

const byTask = aggregate(rows, (row) => `${row.variant}\u0000${row.taskId}`).map((item) => {
  const [variant, taskId] = item.key.split("\u0000");
  return { variant, taskId, ...item.metrics };
});
const overall = aggregate(rows, (row) => row.variant).map((item) => ({
  variant: item.key,
  ...item.metrics,
}));
const output = { generatedAt: new Date().toISOString(), runs: rows.length, byTask, overall };

await writeFile(path.join(resultRoot, "aggregate.json"), `${JSON.stringify(output, null, 2)}\n`, "utf8");
await writeFile(path.join(resultRoot, "aggregate.md"), renderMarkdown(output), "utf8");
process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);

function aggregate(items, keyOf) {
  const groups = new Map();
  for (const item of items) {
    const key = keyOf(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()].map(([key, group]) => {
    const scores = group.map((item) => item.score);
    const elapsed = group.map((item) => item.elapsedMs / 1000);
    const inputTokens = group.map((item) => item.inputTokens).filter(Number.isFinite);
    const outputTokens = group.map((item) => item.outputTokens).filter(Number.isFinite);
    return {
      key,
      metrics: {
        runs: group.length,
        meanScore: round(mean(scores), 1),
        medianScore: round(median(scores), 1),
        minScore: Math.min(...scores),
        maxScore: Math.max(...scores),
        passes: group.filter((item) => item.score >= 80 && !item.timedOut).length,
        qualityPasses: scores.filter((score) => score >= 80).length,
        timeouts: group.filter((item) => item.timedOut).length,
        meanSeconds: round(mean(elapsed), 1),
        medianInputTokens: inputTokens.length ? Math.round(median(inputTokens)) : null,
        medianOutputTokens: outputTokens.length ? Math.round(median(outputTokens)) : null,
        skillEvidenceRuns: group.filter((item) => item.skillEvidence).length,
      },
    };
  });
}

function hasSkillEvidence(variant, trace) {
  if (variant === "baseline") return false;
  const patterns = {
    waza: /waza:(?:hunt|think|check|health|learn|read|write)|plugins[\\/]cache[\\/]waza/iu,
    "matt-skills": /\.agents[\\/]skills[\\/]|diagnosing-bugs|code-review|\btdd\b/iu,
    superpowers: /superpowers:|plugins[\\/]cache[\\/]superpowers|systematic-debugging|test-driven-development|writing-plans/iu,
    "gsd-standard": /gsd-new-project|\.codex[\\/]skills[\\/]gsd|\.planning[\\/]/iu,
    "spec-kit": /speckit-specify|\.agents[\\/]skills[\\/]speckit|\.specify[\\/]/iu,
    bmad: /bmad-spec|\.agents[\\/]skills[\\/]bmad|_bmad[\\/]/iu,
  };
  return patterns[variant]?.test(trace) ?? false;
}

function renderMarkdown(output) {
  const lines = [
    "# 聚合结果",
    "",
    "## 分任务",
    "",
    "| 组别 | 任务 | 均分 | 中位数 | 按时通过 | 质量达标 | 超时 | 平均秒数 | 输入 token 中位数 | Skill 证据 |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const item of output.byTask.sort((a, b) => a.taskId.localeCompare(b.taskId) || a.variant.localeCompare(b.variant))) {
    lines.push(`| ${item.variant} | ${item.taskId} | ${item.meanScore} | ${item.medianScore} | ${item.passes}/${item.runs} | ${item.qualityPasses}/${item.runs} | ${item.timeouts} | ${item.meanSeconds} | ${item.medianInputTokens ?? "-"} | ${item.skillEvidenceRuns}/${item.runs} |`);
  }
  lines.push(
    "",
    "## 全套",
    "",
    "| 组别 | 均分 | 中位数 | 按时通过 | 质量达标 | 超时 | 平均秒数 | 输入 token 中位数 | Skill 证据 |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  );
  for (const item of output.overall.sort((a, b) => b.meanScore - a.meanScore)) {
    lines.push(`| ${item.variant} | ${item.meanScore} | ${item.medianScore} | ${item.passes}/${item.runs} | ${item.qualityPasses}/${item.runs} | ${item.timeouts} | ${item.meanSeconds} | ${item.medianInputTokens ?? "-"} | ${item.skillEvidenceRuns}/${item.runs} |`);
  }
  return `${lines.join("\n")}\n`;
}

async function findFiles(root, name) {
  const found = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) found.push(...(await findFiles(entryPath, name)));
    else if (entry.name === name) found.push(entryPath);
  }
  return found;
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
