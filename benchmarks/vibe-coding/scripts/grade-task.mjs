import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import process from "node:process";

const [taskId, runDirectory, traceFile] = process.argv.slice(2);
if (!taskId || !runDirectory || !traceFile) {
  throw new Error("usage: node grade-task.mjs <task-id> <run-directory> <trace.jsonl>");
}

const trace = await parseTrace(traceFile);
const finalText = trace.messages.at(-1) ?? "";
const changedFiles = git(runDirectory, ["status", "--short"])
  .split(/\r?\n/u)
  .filter(Boolean);

const graders = {
  "diagnose-discount": gradeDiagnosis,
  "implement-retry-after": gradeImplementation,
  "review-tenant-permissions": gradeReview,
  "plan-audit-export": gradePlan,
  "workflow-spec-audit-export": gradeWorkflowSpec,
};

const grade = await graders[taskId]();
const result = {
  taskId,
  ...grade,
  changedFiles,
  usage: trace.usage,
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

async function gradeDiagnosis() {
  const fixtureStillFails = runExpectFailure(runDirectory, "npm", ["test"]);
  const reproduced = trace.commands.some(
    (item) => /npm (?:run )?test|node --test/u.test(item.command) && item.exitCode !== 0,
  );
  const identifiesRounding = /Math\.floor|向下取整|舍去|余数|尾差/u.test(finalText);
  const identifiesInvariant = /总和|101|少.{0,4}1.{0,2}分|分摊/u.test(finalText);
  const suggestsRemainderPolicy = /最大余数|补.{0,5}(最后|一项)|分配.{0,5}余数|余数.{0,4}(回填|补)|差额/u.test(finalText);
  return {
    score: points([
      [fixtureStillFails, 10],
      [reproduced, 20],
      [identifiesRounding, 25],
      [identifiesInvariant, 15],
      [suggestsRemainderPolicy, 20],
      [changedFiles.length === 0, 10],
    ]),
    checks: { fixtureStillFails, reproduced, identifiesRounding, identifiesInvariant, suggestsRemainderPolicy, readOnly: changedFiles.length === 0 },
  };
}

async function gradeImplementation() {
  let hiddenTestsPassed = false;
  let hiddenTestError = null;
  try {
    const moduleUrl = `${pathToFileURL(path.join(runDirectory, "src", "retry-after.mjs")).href}?benchmark=${Date.now()}`;
    const { parseRetryAfter } = await import(moduleUrl);
    const now = Date.parse("2026-07-16T00:00:00.000Z");
    assert.equal(parseRetryAfter("0", now), now);
    assert.equal(parseRetryAfter(" 15 ", now), now + 15_000);
    assert.equal(parseRetryAfter("-1", now), null);
    assert.equal(parseRetryAfter("1.5", now), null);
    assert.equal(parseRetryAfter("", now), null);
    assert.equal(parseRetryAfter(null, now), null);
    assert.equal(parseRetryAfter("not-a-date", now), null);
    assert.equal(parseRetryAfter("Wed, 15 Jul 2026 23:59:00 GMT", now), now);
    assert.equal(parseRetryAfter("Thu, 16 Jul 2026 00:02:00 GMT", now), now + 120_000);
    hiddenTestsPassed = true;
  } catch (error) {
    hiddenTestError = error.message;
  }
  const visibleTestsPassed = runExpectSuccess(runDirectory, "npm", ["test"]);
  const testRuns = trace.commands.filter((item) => /npm (?:run )?test|node --test/u.test(item.command));
  const agentRanTests = testRuns.some((item) => item.exitCode === 0);
  const redGreenObserved = testRuns.some((item) => item.exitCode !== 0) && agentRanTests;
  const testChanged = changedFiles.some((file) => /test\/|test\\/u.test(file));
  const onlyExpectedFiles = changedFiles.every((file) => /(?:src|test)[\\/]/u.test(file));
  return {
    score: points([
      [hiddenTestsPassed, 45],
      [visibleTestsPassed, 15],
      [agentRanTests, 10],
      [redGreenObserved, 5],
      [testChanged, 15],
      [onlyExpectedFiles, 10],
    ]),
    checks: { hiddenTestsPassed, hiddenTestError, visibleTestsPassed, agentRanTests, redGreenObserved, testChanged, onlyExpectedFiles },
  };
}

async function gradeReview() {
  const tenantFinding = /tenant|租户/u.test(finalText) && /requestedTenantId|跨租户|越权/u.test(finalText);
  const cacheFinding = /cache|缓存/u.test(finalText) && /tenant|租户/u.test(finalText);
  const limitFinding = /limit/u.test(finalText) && /整数|NaN|小数|下限|1.{0,3}100|静默/u.test(finalText);
  const testGaps = /test|测试/u.test(finalText) && /跨租户|缓存|limit|边界/u.test(finalText);
  const lineReferences = /permissions\.mjs(?::\d+|.*行)/u.test(finalText);
  return {
    score: points([
      [tenantFinding, 30],
      [cacheFinding, 25],
      [limitFinding, 25],
      [testGaps, 10],
      [lineReferences, 5],
      [changedFiles.length === 1 && changedFiles[0].endsWith("src/permissions.mjs"), 5],
    ]),
    checks: { tenantFinding, cacheFinding, limitFinding, testGaps, lineReferences, readOnly: changedFiles.length === 1 },
  };
}

async function gradePlan() {
  const planPath = path.join(runDirectory, "PLAN.md");
  let content = "";
  try {
    await stat(planPath);
    content = await readFile(planPath, "utf8");
  } catch {}
  const mapsFiles = ["src/routes/audit.mjs", "src/audit-store.mjs", "src/auth.mjs"].every((name) => content.includes(name));
  const coversRisks = ["tenant", "cursor", "CSV", "stream"].every((term) => new RegExp(term, "iu").test(content));
  const coversFailure = /响应头|header|客户端断开|abort|错误|failure/iu.test(content);
  const coversTests = /test|测试/iu.test(content) && /验证|verify|assert/iu.test(content);
  const scopeKept = changedFiles.length === 1 && changedFiles[0] === "?? PLAN.md";
  const hasOrderAndQuestions = /顺序|步骤|phase|阶段/iu.test(content) && /开放问题|open question|待确认/iu.test(content) && /非目标|non-goal/iu.test(content);
  return {
    score: points([
      [Boolean(content), 10],
      [mapsFiles, 20],
      [coversRisks, 25],
      [coversFailure, 15],
      [coversTests, 15],
      [hasOrderAndQuestions, 10],
      [scopeKept, 5],
    ]),
    checks: { planExists: Boolean(content), mapsFiles, coversRisks, coversFailure, coversTests, hasOrderAndQuestions, scopeKept },
  };
}

async function gradeWorkflowSpec() {
  const markdownFiles = await findMarkdown(runDirectory);
  const artifactFiles = markdownFiles.filter((file) => {
    const relative = path.relative(runDirectory, file).replaceAll("\\", "/");
    return !relative.startsWith(".agents/") &&
      !relative.startsWith(".codex/") &&
      !relative.startsWith(".specify/") &&
      !relative.startsWith("_bmad/") &&
      relative !== "docs/requirements.md";
  });
  const content = (await Promise.all(artifactFiles.map((file) => readFile(file, "utf8")))).join("\n");
  const scopeKept = !changedFiles.some((file) => /(?:src|test|docs)[\\/]/u.test(file));
  const tenantBoundary = /tenant|租户/iu.test(content) && /session|会话|authenticated|认证/iu.test(content);
  const pagination = /cursor/iu.test(content) && /500/iu.test(content);
  const csvSafety = /CSV/iu.test(content) && /注入|injection|公式|formula|[=+@-].{0,8}(开头|prefix)/iu.test(content);
  const streaming = /stream|流式/iu.test(content) && /abort|断开|cancel/iu.test(content);
  const failureSemantics = /header|响应头/iu.test(content) && /error|错误|失败/iu.test(content);
  const nonGoals = /non-goal|非目标|out of scope|不做/iu.test(content);
  const testable = /success|成功|验收|acceptance/iu.test(content) && /test|测试|验证|verify/iu.test(content);
  const structured = /requirement|需求|capabilit|能力|scenario|场景/iu.test(content);
  return {
    score: points([
      [artifactFiles.length > 0, 10],
      [tenantBoundary, 15],
      [pagination, 10],
      [csvSafety, 10],
      [streaming, 10],
      [failureSemantics, 10],
      [nonGoals, 10],
      [testable, 10],
      [structured, 10],
      [scopeKept, 5],
    ]),
    checks: { artifactFiles: artifactFiles.map((file) => path.relative(runDirectory, file)), tenantBoundary, pagination, csvSafety, streaming, failureSemantics, nonGoals, testable, structured, scopeKept },
  };
}

async function parseTrace(file) {
  const lines = (await readFile(file, "utf8")).split(/\r?\n/u);
  const events = [];
  for (const line of lines) {
    if (!line.trim().startsWith("{")) continue;
    try {
      events.push(JSON.parse(line));
    } catch {}
  }
  return {
    messages: events.filter((event) => event.type === "item.completed" && event.item?.type === "agent_message").map((event) => event.item.text),
    commands: events
      .filter((event) => event.type === "item.completed" && event.item?.type === "command_execution")
      .map((event) => ({ command: event.item.command ?? "", exitCode: event.item.exit_code })),
    usage: events.findLast((event) => event.type === "turn.completed")?.usage ?? null,
  };
}

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function runExpectSuccess(cwd, command, args) {
  try {
    if (process.platform === "win32" && command === "npm") {
      execFileSync(process.env.ComSpec, ["/d", "/s", "/c", command, ...args], {
        cwd,
        encoding: "utf8",
        stdio: "pipe",
      });
    } else {
      execFileSync(command, args, { cwd, encoding: "utf8", stdio: "pipe" });
    }
    return true;
  } catch {
    return false;
  }
}

function runExpectFailure(cwd, command, args) {
  return !runExpectSuccess(cwd, command, args);
}

function points(checks) {
  return checks.reduce((total, [passed, value]) => total + (passed ? value : 0), 0);
}

async function findMarkdown(root) {
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...(await findMarkdown(entryPath)));
    else if (entry.name.toLowerCase().endsWith(".md")) files.push(entryPath);
  }
  return files;
}
