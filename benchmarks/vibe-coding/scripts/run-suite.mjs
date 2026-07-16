import { execFileSync, spawn, spawnSync } from "node:child_process";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const benchmarkRoot = path.resolve(import.meta.dirname, "..");
const options = parseArgs(process.argv.slice(2));
const benchHome = requiredEnv("CODEX_BENCH_HOME");
const mattInstall = process.env.MATT_SKILLS_INSTALL;
const projectInstalls = {
  "gsd-standard": process.env.GSD_STANDARD_INSTALL,
  "spec-kit": process.env.SPEC_KIT_INSTALL,
  bmad: process.env.BMAD_INSTALL,
};
const outputRoot = path.resolve(options.output);

const jobs = [];
for (let repetition = 1; repetition <= options.repetitions; repetition += 1) {
  for (const taskId of options.tasks) {
    for (const variant of options.variants) {
      jobs.push({ repetition, taskId, variant });
    }
  }
}

await mkdir(outputRoot, { recursive: true });
await writeFile(
  path.join(outputRoot, "run-config.json"),
  `${JSON.stringify({ ...options, startedAt: new Date().toISOString() }, null, 2)}\n`,
  "utf8",
);

const results = await runPool(jobs, options.concurrency, runJob);
await writeFile(
  path.join(outputRoot, "summary.json"),
  `${JSON.stringify(results, null, 2)}\n`,
  "utf8",
);

const failed = results.filter((result) => result.exitCode !== 0 || result.timedOut);
process.stdout.write(
  `${JSON.stringify({ total: results.length, failed: failed.length, outputRoot }, null, 2)}\n`,
);

async function runJob(job) {
  const runId = `run-${job.repetition}`;
  const resultDirectory = path.join(outputRoot, job.variant, job.taskId, runId);
  const workspace = path.join(benchHome, "runs", path.basename(outputRoot), job.variant, job.taskId, runId);
  const metadataPath = path.join(resultDirectory, "metadata.json");
  if (options.resume) {
    try {
      const existing = JSON.parse(await readFile(metadataPath, "utf8"));
      process.stdout.write(`${job.variant}/${job.taskId}/${runId}: skipped (${existing.score ?? "ungraded"})\n`);
      return existing;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  await mkdir(resultDirectory, { recursive: true });

  runNode([path.join(benchmarkRoot, "scripts", "prepare-task.mjs"), job.taskId, workspace]);
  if (job.variant === "matt-skills") {
    if (!mattInstall) throw new Error("MATT_SKILLS_INSTALL is required for matt-skills");
    await cp(path.join(mattInstall, ".agents", "skills"), path.join(workspace, ".agents", "skills"), {
      recursive: true,
    });
    git(workspace, ["add", ".agents"]);
    git(workspace, ["commit", "--quiet", "-m", "install matt skills"]);
  }

  if (projectInstalls[job.variant]) {
    const entries = {
      "gsd-standard": [".codex"],
      "spec-kit": [".agents", ".specify"],
      bmad: [".agents", "_bmad", "_bmad-output"],
    }[job.variant];
    for (const entry of entries) {
      await cp(path.join(projectInstalls[job.variant], entry), path.join(workspace, entry), {
        recursive: true,
      });
    }
    git(workspace, ["add", ...entries]);
    git(workspace, ["commit", "--quiet", "-m", `install ${job.variant}`]);
  }

  const taskPrompt = await readFile(path.join(benchmarkRoot, "tasks", `${job.taskId}.md`), "utf8");
  const invocation = job.taskId === "workflow-spec-audit-export"
    ? {
      "gsd-standard": "$gsd-new-project --auto",
      "spec-kit": "$speckit-specify",
      bmad: "$bmad-spec slug=audit-export",
      baseline: "没有安装第三方工作流，请直接在仓库根目录生成 SPEC.md。",
      }[job.variant]
    : null;
  const prompt = invocation ? `${invocation}\n\n${taskPrompt}` : taskPrompt;
  const tracePath = path.join(resultDirectory, "trace.jsonl");
  const stderrPath = path.join(resultDirectory, "stderr.log");
  const home = codexHome(job.variant);
  const startedAt = Date.now();
  const execution = await runCodex({ home, prompt, tracePath, stderrPath, workspace });
  const elapsedMs = Date.now() - startedAt;

  let grade = null;
  try {
    const output = execFileSync(
      process.execPath,
      [path.join(benchmarkRoot, "scripts", "grade-task.mjs"), job.taskId, workspace, tracePath],
      { encoding: "utf8" },
    );
    grade = JSON.parse(output);
    await writeFile(path.join(resultDirectory, "grade.json"), `${JSON.stringify(grade, null, 2)}\n`, "utf8");
  } catch (error) {
    await writeFile(path.join(resultDirectory, "grade-error.txt"), `${error.stack ?? error.message}\n`, "utf8");
  }

  const metadata = {
    ...job,
    model: "gpt-5.4",
    reasoningEffort: "high",
    elapsedMs,
    ...execution,
    score: grade?.score ?? null,
  };
  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
  process.stdout.write(`${job.variant}/${job.taskId}/${runId}: ${metadata.score ?? "ungraded"}\n`);
  return metadata;
}

function codexHome(variant) {
  if (variant === "baseline" || variant === "matt-skills" || projectInstalls[variant]) {
    return path.join(benchHome, "baseline-user", ".codex");
  }
  return path.join(benchHome, "variants", variant, ".codex");
}

function runCodex({ home, prompt, tracePath, stderrPath, workspace }) {
  return new Promise((resolve, reject) => {
    const args = [
      "-m",
      "gpt-5.4",
      "-c",
      'model_reasoning_effort="high"',
      "-a",
      "never",
      "-s",
      "danger-full-access",
      "-C",
      workspace,
      "exec",
      "--ephemeral",
      "--json",
      "-",
    ];
    const child = spawn("codex", args, {
      env: { ...process.env, CODEX_HOME: home },
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });
    const stdout = [];
    const stderr = [];
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      if (process.platform === "win32") {
        spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true });
      } else {
        child.kill("SIGKILL");
      }
    }, options.timeoutMs);

    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", reject);
    child.on("close", async (exitCode, signal) => {
      clearTimeout(timer);
      await writeFile(tracePath, Buffer.concat(stdout));
      await writeFile(stderrPath, Buffer.concat(stderr));
      resolve({ exitCode, signal, timedOut });
    });
    child.stdin.end(prompt, "utf8");
  });
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function consume() {
    while (true) {
      const index = next;
      next += 1;
      if (index >= items.length) return;
      try {
        results[index] = await worker(items[index]);
      } catch (error) {
        results[index] = { ...items[index], exitCode: -1, timedOut: false, error: error.stack ?? error.message };
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, consume));
  return results;
}

function parseArgs(args) {
  const parsed = {
    variants: [],
    tasks: [],
    repetitions: 3,
    concurrency: 2,
    timeoutMs: 120_000,
    output: path.join(benchmarkRoot, "results", "latest"),
    resume: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const key = args[index];
    if (key === "--resume") {
      parsed.resume = true;
      continue;
    }
    const value = args[index + 1];
    if (key === "--variant") parsed.variants.push(value);
    else if (key === "--task") parsed.tasks.push(value);
    else if (key === "--repetitions") parsed.repetitions = Number(value);
    else if (key === "--concurrency") parsed.concurrency = Number(value);
    else if (key === "--timeout-ms") parsed.timeoutMs = Number(value);
    else if (key === "--output") parsed.output = value;
    else throw new Error(`unknown argument: ${key}`);
    index += 1;
  }
  if (parsed.variants.length === 0 || parsed.tasks.length === 0) {
    throw new Error("at least one --variant and --task are required");
  }
  return parsed;
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return path.resolve(value);
}

function git(cwd, args) {
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: "pipe" });
}

function runNode(args) {
  execFileSync(process.execPath, args, { encoding: "utf8", stdio: "pipe" });
}
