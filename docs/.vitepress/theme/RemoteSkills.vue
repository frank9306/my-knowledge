<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface GitHubTreeItem { path: string; type: string }
interface GitHubTreeResponse { tree?: GitHubTreeItem[]; truncated?: boolean }
interface Skill { category: string; description: string; name: string; path: string }

const repositoryUrl = 'https://github.com/frank9306/agent-skills'
const treeUrl = 'https://api.github.com/repos/frank9306/agent-skills/git/trees/main?recursive=1'
const readmeUrl = 'https://api.github.com/repos/frank9306/agent-skills/contents/README.md?ref=main'
const skills = ref<Skill[]>([])
const error = ref('')
const loading = ref(true)
let controller: AbortController | undefined

const groups = computed(() => {
  const result = new Map<string, Skill[]>()
  for (const skill of skills.value) {
    const group = result.get(skill.category) ?? []
    group.push(skill)
    result.set(skill.category, group)
  }
  return [...result.entries()].sort(([left], [right]) => left.localeCompare(right))
})

function readDescriptions(source: string) {
  const descriptions = new Map<string, string>()
  for (const line of source.split('\n')) {
    const cells = line.split('|').map((cell) => cell.trim())
    const name = cells[1]?.match(/`([^`]+)`/)?.[1]
    const description = cells[3]
    if (name && description && description !== 'Purpose' && !/^[-:]+$/.test(description)) {
      descriptions.set(name, description)
    }
  }
  return descriptions
}

async function readGitHubFile(response: Response | undefined) {
  if (!response?.ok) return ''
  const data = (await response.json()) as { content?: string; encoding?: string }
  if (data.encoding !== 'base64' || !data.content) return ''
  const bytes = Uint8Array.from(atob(data.content.replace(/\s/g, '')), (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

async function load() {
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  error.value = ''
  try {
    const [response, readmeResponse] = await Promise.all([
      fetch(treeUrl, { cache: 'no-store', signal: controller.signal }),
      fetch(readmeUrl, { cache: 'no-store', signal: controller.signal }).catch(() => undefined)
    ])
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`)
    const data = (await response.json()) as GitHubTreeResponse
    if (data.truncated) throw new Error('GitHub returned a truncated repository tree')
    const descriptions = readDescriptions(await readGitHubFile(readmeResponse))
    const paths = (data.tree ?? [])
      .filter(({ path, type }) => type === 'blob' && /^skills\/[^/]+\/[^/]+\/SKILL\.md$/.test(path))
      .map(({ path }) => path)
    const loaded = paths.map((path) => {
      const [, category = 'other', directory = 'unknown'] = path.split('/')
      return { category, description: descriptions.get(directory) ?? '', name: directory, path }
    })
    skills.value = loaded.sort((left, right) => left.name.localeCompare(right.name))
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === 'AbortError') return
    error.value = reason instanceof Error ? reason.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

onMounted(load)
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <section class="remote-source" aria-labelledby="skills-source-title">
    <h2 id="skills-source-title" class="sr-only">Agent Skills 清单</h2>
    <p v-if="loading" class="remote-source__status" role="status">加载中…</p>
    <div v-else-if="error" class="remote-source__error" role="alert">
      <p>加载失败：{{ error }}</p>
      <button type="button" @click="load">重试</button>
    </div>
    <div v-else-if="groups.length">
      <p class="remote-source__count">{{ skills.length }} 个公开 Skills</p>
      <div class="skill-groups">
      <section v-for="[category, items] in groups" :key="category" class="skill-group">
        <h3>{{ category }}</h3>
        <ul>
          <li v-for="skill in items" :key="skill.path">
            <a :href="`${repositoryUrl}/blob/main/${skill.path}`" target="_blank" rel="noopener noreferrer">
              <code>{{ skill.name }}</code>
              <span>{{ skill.description || '该 Skill 暂未提供描述。' }}</span>
            </a>
            <code class="skill-group__install">npx skills add frank9306/agent-skills --skill {{ skill.name }} -g</code>
          </li>
        </ul>
      </section>
      </div>
    </div>
    <p v-else class="remote-source__status">暂无公开 Skills。</p>
    <a class="remote-source__link" :href="repositoryUrl" target="_blank" rel="noopener noreferrer">源仓库</a>
  </section>
</template>
