<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
import CrtHead from './CrtHead.vue'
import HomeTimeline from './HomeTimeline.vue'

const PERSON_POSITION_KEY = 'frank-archive:person-position'
const WELCOME_DATE_KEY = 'frank-archive:crt-404-welcome-date'
const WELCOME_DELAY_MS = 600
const CLICK_WINDOW_MS = 2000
const CLICK_RESET_MS = 3000
const WARNING_CLICK_COUNT = 4
const ROAST_CLICK_COUNT = 7

type PetReaction = 'notice' | 'pet' | 'grab' | 'release' | 'welcome' | 'warn' | 'roast'
type PetController = { react: (reaction: PetReaction, intensity?: number) => void }
type DialogueTone = 'welcome' | 'normal' | 'warning' | 'roast'

const welcomeLines = [
  '欢迎进入档案馆。知识免费，理解能力请自备。',
  'CRT-404 馆长值班中。放心，丢失的只有时间，不是档案。',
  '欢迎。这里收藏知识，也临时寄存没想明白的问题。',
  '门没锁，脑洞也别锁。CRT-404 为你开馆。'
]
const normalLines = [
  '嗯，触控正常。你的好奇心也勉强正常。',
  '摸一下可以，知识不会因此自动进入脑子。',
  '馆长在线。提问请走脑子，不要只走手指。',
  '收到一次点击。它的学术价值仍在评估。'
]
const warningLines = [
  '手指很忙啊。脑子那边也开工了吗？',
  '第四下了。你是在敲门，还是给鼠标做压力测试？',
  '友情提醒：狂点不会解锁隐藏论文，只会解锁馆长脾气。',
  '停一下。你点得这么坚定，显得目的尤其可疑。'
]
const roastLines = [
  '你他妈是把鼠标当心肺复苏机了吗？',
  '再点几下，浏览器没崩，我先给你的耐心立碑。',
  '这手速配上这个目标感，像极了拿电钻修手表。',
  '点击次数挺有产出，唯一没产出的是意义。',
  '别按了。按钮都快懂了，你还没懂。',
  '你这种坚持要是用来看文章，现在都能写参考文献了。',
  '好家伙，知识没点开，馆长的血压让你点开了。',
  '继续。等你把鼠标点穿，馆里正好缺一件行为艺术。'
]

const figure = ref<HTMLElement | null>(null)
const speech = ref<HTMLElement | null>(null)
const pet = ref<PetController | null>(null)
const dragPosition = ref<{ x: number; y: number } | null>(null)
const dragging = ref(false)
const dialogue = ref<{ text: string; tone: DialogueTone } | null>(null)
const speechStyle = ref<CSSProperties>({})
const speechBelow = ref(false)
let dragOffset = { x: 0, y: 0 }
let dragOrigin = { x: 0, y: 0 }
let previousPointer = { x: 0, y: 0, time: 0 }
let dragTravel = 0
let releaseSpeed = 0
let welcomeTimer: ReturnType<typeof setTimeout> | undefined
let speechTimer: ReturnType<typeof setTimeout> | undefined
let clickResetTimer: ReturnType<typeof setTimeout> | undefined
let clickTimes: number[] = []
const lastLineIndexes = new Map<DialogueTone, number>()

const figureStyle = computed(() => dragPosition.value ? {
  left: `${dragPosition.value.x}px`, top: `${dragPosition.value.y}px`, right: 'auto', bottom: 'auto'
} : undefined)

function pickLine(tone: DialogueTone, lines: string[]) {
  let index = Math.floor(Math.random() * lines.length)
  if (lines.length > 1 && index === lastLineIndexes.get(tone)) index = (index + 1) % lines.length
  lastLineIndexes.set(tone, index)
  return lines[index]
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function updateSpeechPosition() {
  if (!dialogue.value || !figure.value || !speech.value) return
  const figureRect = figure.value.getBoundingClientRect()
  const speechRect = speech.value.getBoundingClientRect()
  const gap = 12
  const edge = 8
  const aboveTop = figureRect.top - speechRect.height - gap
  speechBelow.value = aboveTop < edge
  const top = speechBelow.value
    ? Math.min(window.innerHeight - speechRect.height - edge, figureRect.bottom + gap)
    : aboveTop
  const idealLeft = figureRect.left + figureRect.width / 2 - speechRect.width / 2
  const left = Math.min(Math.max(edge, idealLeft), Math.max(edge, window.innerWidth - speechRect.width - edge))
  const tailX = Math.min(
    Math.max(18, figureRect.left + figureRect.width / 2 - left),
    Math.max(18, speechRect.width - 18)
  )
  speechStyle.value = {
    left: `${left}px`, top: `${Math.max(edge, top)}px`, '--speech-tail-x': `${tailX}px`
  } as CSSProperties
}

async function say(tone: DialogueTone, lines: string[], duration: number) {
  if (speechTimer) clearTimeout(speechTimer)
  dialogue.value = { tone, text: pickLine(tone, lines) }
  await nextTick()
  updateSpeechPosition()
  speechTimer = setTimeout(() => {
    dialogue.value = null
    speechTimer = undefined
  }, duration)
}

function clampPosition(x: number, y: number) {
  const rect = figure.value?.getBoundingClientRect()
  if (!rect) return { x, y }
  return {
    x: Math.min(Math.max(8, x), Math.max(8, window.innerWidth - rect.width - 8)),
    y: Math.min(Math.max(8, y), Math.max(8, window.innerHeight - rect.height - 8))
  }
}

function startDragging(event: PointerEvent) {
  if (event.button !== 0 || !figure.value) return
  const rect = figure.value.getBoundingClientRect()
  dragPosition.value = { x: rect.left, y: rect.top }
  dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  dragOrigin = { x: event.clientX, y: event.clientY }
  previousPointer = { x: event.clientX, y: event.clientY, time: event.timeStamp }
  dragTravel = 0
  releaseSpeed = 0
  dragging.value = true
  pet.value?.react('grab')
  figure.value.setPointerCapture(event.pointerId)
  event.preventDefault()
}

function moveDragging(event: PointerEvent) {
  if (!dragging.value) return
  const elapsed = Math.max(8, event.timeStamp - previousPointer.time)
  const step = Math.hypot(event.clientX - previousPointer.x, event.clientY - previousPointer.y)
  dragTravel = Math.max(dragTravel, Math.hypot(event.clientX - dragOrigin.x, event.clientY - dragOrigin.y))
  releaseSpeed = releaseSpeed * 0.65 + step / elapsed * 0.35
  previousPointer = { x: event.clientX, y: event.clientY, time: event.timeStamp }
  dragPosition.value = clampPosition(event.clientX - dragOffset.x, event.clientY - dragOffset.y)
  requestAnimationFrame(updateSpeechPosition)
}

function stopDragging(event: PointerEvent) {
  if (!dragging.value || !figure.value || !dragPosition.value) return
  dragging.value = false
  pet.value?.react('release', Math.min(1, releaseSpeed / 1.4))
  if (figure.value.hasPointerCapture(event.pointerId)) figure.value.releasePointerCapture(event.pointerId)
  const rect = figure.value.getBoundingClientRect()
  const availableX = Math.max(1, window.innerWidth - rect.width)
  const availableY = Math.max(1, window.innerHeight - rect.height)
  window.localStorage.setItem(PERSON_POSITION_KEY, JSON.stringify({
    x: dragPosition.value.x / availableX, y: dragPosition.value.y / availableY
  }))
}

function resetClickStreak() {
  clickTimes = []
  clickResetTimer = undefined
}

function activatePet() {
  const now = performance.now()
  clickTimes = clickTimes.filter((time) => now - time <= CLICK_WINDOW_MS)
  clickTimes.push(now)
  if (clickResetTimer) clearTimeout(clickResetTimer)
  clickResetTimer = setTimeout(resetClickStreak, CLICK_RESET_MS)

  const count = clickTimes.length
  if (count >= ROAST_CLICK_COUNT) {
    pet.value?.react('roast', Math.min(1, 0.6 + (count - ROAST_CLICK_COUNT) * 0.05))
    if (count === ROAST_CLICK_COUNT || (count - ROAST_CLICK_COUNT) % 3 === 0) void say('roast', roastLines, 5000)
    return
  }
  if (count >= WARNING_CLICK_COUNT) {
    pet.value?.react('warn')
    if (count === WARNING_CLICK_COUNT) void say('warning', warningLines, 4000)
    return
  }
  pet.value?.react('pet')
  void say('normal', normalLines, 3000)
}

function interactWithPet() {
  if (dragTravel >= 6) return
  activatePet()
}

function interactWithPetByKeyboard(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  activatePet()
}

function restorePosition() {
  if (!figure.value) return
  try {
    const stored = JSON.parse(window.localStorage.getItem(PERSON_POSITION_KEY) ?? 'null')
    if (!stored || typeof stored.x !== 'number' || typeof stored.y !== 'number') return
    const rect = figure.value.getBoundingClientRect()
    dragPosition.value = clampPosition(
      stored.x * Math.max(1, window.innerWidth - rect.width),
      stored.y * Math.max(1, window.innerHeight - rect.height)
    )
    requestAnimationFrame(updateSpeechPosition)
  } catch {
    window.localStorage.removeItem(PERSON_POSITION_KEY)
  }
}

function clampCurrentPosition() {
  if (dragPosition.value) dragPosition.value = clampPosition(dragPosition.value.x, dragPosition.value.y)
  requestAnimationFrame(updateSpeechPosition)
}

function welcomeOnceToday() {
  const today = localDateKey()
  try {
    if (window.localStorage.getItem(WELCOME_DATE_KEY) === today) return
    window.localStorage.setItem(WELCOME_DATE_KEY, today)
  } catch {
    // Storage can be unavailable in privacy modes; the welcome still works for this visit.
  }
  pet.value?.react('welcome')
  void say('welcome', welcomeLines, 6000)
}

onMounted(() => {
  requestAnimationFrame(restorePosition)
  welcomeTimer = setTimeout(welcomeOnceToday, WELCOME_DELAY_MS)
  window.addEventListener('resize', clampCurrentPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', clampCurrentPosition)
  if (welcomeTimer) clearTimeout(welcomeTimer)
  if (speechTimer) clearTimeout(speechTimer)
  if (clickResetTimer) clearTimeout(clickResetTimer)
})
</script>

<template>
  <div class="knowledge-home">
    <HomeTimeline />

    <Transition name="crt-speech">
      <div
        v-if="dialogue"
        ref="speech"
        class="knowledge-home__speech"
        :class="[`is-${dialogue.tone}`, { 'is-below': speechBelow }]"
        :style="speechStyle"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span class="knowledge-home__speech-name">CRT-404 馆长</span>
        <span>{{ dialogue.text }}</span>
      </div>
    </Transition>

    <button
      ref="figure"
      type="button"
      class="knowledge-home__figure"
      :class="{ 'is-dragging': dragging }"
      :style="figureStyle"
      aria-label="CRT-404 馆长，可点击交谈或拖动"
      title="点击和 CRT-404 馆长交谈，或按住拖动"
      @pointerenter="pet?.react('notice')"
      @pointerdown="startDragging"
      @pointermove="moveDragging"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
      @click="interactWithPet"
      @keydown="interactWithPetByKeyboard"
    >
      <CrtHead ref="pet" />
    </button>
  </div>
</template>
