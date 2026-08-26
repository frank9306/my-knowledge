<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import CrtHead from './CrtHead.vue'
import HomeTimeline from './HomeTimeline.vue'

const PERSON_POSITION_KEY = 'frank-archive:person-position'
type PetReaction = 'notice' | 'pet' | 'grab' | 'release'
type PetController = { react: (reaction: PetReaction, intensity?: number) => void }

const figure = ref<HTMLElement | null>(null)
const pet = ref<PetController | null>(null)
const dragPosition = ref<{ x: number; y: number } | null>(null)
const dragging = ref(false)
let dragOffset = { x: 0, y: 0 }
let dragOrigin = { x: 0, y: 0 }
let previousPointer = { x: 0, y: 0, time: 0 }
let dragTravel = 0
let releaseSpeed = 0

const figureStyle = computed(() => dragPosition.value ? {
  left: `${dragPosition.value.x}px`,
  top: `${dragPosition.value.y}px`,
  right: 'auto',
  bottom: 'auto'
} : undefined)

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
    x: dragPosition.value.x / availableX,
    y: dragPosition.value.y / availableY
  }))
}

function interactWithPet() {
  if (dragTravel < 6) pet.value?.react('pet')
}

function interactWithPetByKeyboard(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  pet.value?.react('pet')
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
  } catch {
    window.localStorage.removeItem(PERSON_POSITION_KEY)
  }
}

function clampCurrentPosition() {
  if (dragPosition.value) dragPosition.value = clampPosition(dragPosition.value.x, dragPosition.value.y)
}

onMounted(() => {
  requestAnimationFrame(restorePosition)
  window.addEventListener('resize', clampCurrentPosition)
})

onBeforeUnmount(() => window.removeEventListener('resize', clampCurrentPosition))
</script>

<template>
  <div class="knowledge-home">
    <HomeTimeline />

    <button
      ref="figure"
      type="button"
      class="knowledge-home__figure"
      :class="{ 'is-dragging': dragging }"
      :style="figureStyle"
      aria-label="可点击和拖动的 3D AI 小宠物"
      title="点击摸摸它，或按住拖动"
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
