<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const canvas = ref<HTMLCanvasElement>()
let renderer: THREE.WebGLRenderer | undefined
let frame = 0
let resizeObserver: ResizeObserver | undefined
let targetRotationX = 0
let targetRotationY = 0
let cleanup = () => {}

function createBox(
  width: number,
  height: number,
  depth: number,
  material: THREE.Material,
  position: [number, number, number]
) {
  const radius = Math.min(width, height, depth) * 0.08
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 4, radius), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

onMounted(() => {
  if (!canvas.value) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(0, 0.15, 8.2)

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const head = new THREE.Group()
  head.position.y = -1.28
  scene.add(head)

  const shell = new THREE.MeshStandardMaterial({ color: 0x938779, roughness: 0.66, metalness: 0.04 })
  const shellDark = new THREE.MeshStandardMaterial({ color: 0x665e55, roughness: 0.75 })
  const black = new THREE.MeshStandardMaterial({ color: 0x080909, roughness: 0.42 })
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff2d8,
    emissive: 0xffe2ac,
    emissiveIntensity: 3.5,
    roughness: 0.18
  })

  const computer = new THREE.Group()
  // Keep the shell's bottom face exactly on the neck pivot. The body image
  // already contains the visible neck mount, so no second connector is drawn.
  computer.position.y = 1.275
  head.add(computer)

  computer.add(createBox(2.82, 2.55, 2.22, shell, [0, 0, 0]))
  computer.add(createBox(2.5, 1.55, 0.15, shellDark, [0, 0.3, 1.16]))
  computer.add(createBox(2.2, 1.28, 0.1, black, [0, 0.32, 1.26]))
  computer.add(createBox(2.45, 0.62, 0.16, shell, [0, -0.88, 1.17]))
  computer.add(createBox(0.92, 0.1, 0.07, black, [0.42, -0.83, 1.29]))
  computer.add(createBox(0.13, 0.13, 0.07, black, [0.98, -1.03, 1.29]))

  const eyeGeometry = new THREE.SphereGeometry(0.25, 32, 24)
  for (const x of [-0.55, 0.55]) {
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    eye.position.set(x, 0.34, 1.37)
    eye.scale.set(0.78, 1.2, 0.22)
    computer.add(eye)
  }

  const ventMaterial = new THREE.MeshStandardMaterial({ color: 0x292725, roughness: 0.8 })
  for (let index = 0; index < 5; index += 1) {
    computer.add(createBox(1.35, 0.035, 0.035, ventMaterial, [0, 0.5 - index * 0.12, -1.13]))
  }

  scene.add(new THREE.HemisphereLight(0xd9c6aa, 0x080909, 1.45))
  const keyLight = new THREE.DirectionalLight(0xffe0b9, 4.2)
  keyLight.position.set(-4, 5, 5)
  keyLight.castShadow = true
  scene.add(keyLight)
  const rimLight = new THREE.DirectionalLight(0x8da1ad, 2.1)
  rimLight.position.set(4, 2, -4)
  scene.add(rimLight)

  const handlePointerMove = (event: PointerEvent) => {
    targetRotationY = (event.clientX / window.innerWidth * 2 - 1) * Math.PI
    const downwardPointer = Math.max(0, event.clientY / window.innerHeight * 2 - 1)
    targetRotationX = downwardPointer * 0.34
  }

  const resize = () => {
    if (!canvas.value || !renderer) return
    const { clientWidth, clientHeight } = canvas.value
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }

  const render = () => {
    head.rotation.y += (targetRotationY - head.rotation.y) * 0.0098
    head.rotation.x += (targetRotationX - head.rotation.x) * 0.0098
    renderer?.render(scene, camera)
    frame = requestAnimationFrame(render)
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas.value)
  resize()
  render()

  cleanup = () => {
    window.removeEventListener('pointermove', handlePointerMove)
    cancelAnimationFrame(frame)
    resizeObserver?.disconnect()
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => material.dispose())
    })
    renderer?.dispose()
  }
})

onBeforeUnmount(() => cleanup())
</script>

<template>
  <canvas ref="canvas" class="crt-head" aria-hidden="true" />
</template>
