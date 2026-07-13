import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.cwd());
const docsRoot = path.join(root, 'docs');
const readmePath = path.join(root, 'README.md');

const topicOrder = [
  ['ai-agent', 'AI Agent'],
  ['python-automation', 'Python 自动化'],
  ['rpa-playwright', 'RPA / Playwright'],
  ['web-react', 'Web / React'],
  ['blog', '博客文章'],
];

const pageOrder = [
  ['/', '首页'],
  ['/topics/', '专题总览'],
  ['/blog/', '文章索引'],
  ['/reading/', '优秀的资源'],
  ['/resources/', '资源导航'],
  ['/friends', '友链'],
  ['/about', '关于'],
  ['/agents', 'AGENTS.md'],
  ['/skills', 'Agent Skills'],
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

async function readArticleMeta(file) {
  const text = await fs.readFile(file, 'utf8');
  const title =
    text.match(/^title:\s*"(.+)"\s*$/m)?.[1] ||
    text.match(/^#\s+(.+)$/m)?.[1] ||
    path.basename(file, '.md');
  const dateRaw = text.match(/^date:\s*(.+)$/m)?.[1]?.trim();
  const date = dateRaw ? new Date(dateRaw) : null;
  return { title: title.trim(), date: date && !Number.isNaN(date.getTime()) ? date : null };
}

async function main() {
  const groups = [];
  for (const [dir, label] of topicOrder) {
    const sectionDir = path.join(docsRoot, dir);
    let files = [];
    try {
      files = await walk(sectionDir);
    } catch {
      continue;
    }
    const mdFiles = files.filter(
      (file) => file.endsWith('.md') && path.basename(file) !== 'index.md',
    );
    const items = [];
    for (const file of mdFiles) {
      const slug = path.basename(file, '.md');
      const { title, date } = await readArticleMeta(file);
      items.push({ title, date, link: `https://knowledge.webfrank.top/${dir}/${slug}/` });
    }
    items.sort((a, b) => {
      if (a.date && b.date) return b.date - a.date;
      if (a.date) return -1;
      if (b.date) return 1;
      return a.title.localeCompare(b.title, 'zh-CN');
    });
    groups.push({ label, items });
  }

  const totalArticles = groups.reduce((sum, group) => sum + group.items.length, 0);

  const pageLinks = pageOrder
    .map(([path, label]) => `- [${label}](https://knowledge.webfrank.top${path})`)
    .join('\n');

  const groupSections = groups
    .filter((group) => group.items.length)
    .map((group) => {
      const items = group.items
        .map((item) => `- [${item.title}](${item.link})`)
        .join('\n');
      return `### ${group.label}\n\n${items}`;
    })
    .join('\n\n');

  const readme = `# Frank 的知识库

个人知识网站，托管在 GitHub Pages：[https://knowledge.webfrank.top/](https://knowledge.webfrank.top/)

这里是网站内容的导航，不是部署说明。

## 主要页面

${pageLinks}

## 专题文章

本站共收录 ${totalArticles} 篇专题文章。

${groupSections}

## 内容维护约定

- 新增专题文章：在对应专题目录下创建 Markdown 文件，frontmatter 里带 title，并刷新本 README。
- 删除文章：直接删除文件，并在本 README 同提交里同步移除链接。
- 自动化：本 README 由 scripts/sync-readme.mjs 根据 docs 目录结构自动生成，运行 pnpm run readme:sync 即可刷新。
`;

  await fs.writeFile(readmePath, readme.trimEnd() + '\n', 'utf8');
  console.log(`README.md updated with ${totalArticles} articles across ${groups.filter((g) => g.items.length).length} topics.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
