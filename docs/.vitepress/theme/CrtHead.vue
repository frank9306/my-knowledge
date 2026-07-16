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
  return mesh
}

function createLimb(
  radius: number,
  length: number,
  material: THREE.Material,
  position: [number, number, number]
) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 8, 18), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  return mesh
}

onMounted(() => {
  if (!canvas.value) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100)
  camera.position.set(0, 0.15, 12)

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const character = new THREE.Group()
  character.rotation.y = -0.08
  scene.add(character)

  const shell = new THREE.MeshStandardMaterial({ color: 0x9a8872, roughness: 0.68, metalness: 0.04 })
  const shellDark = new THREE.MeshStandardMaterial({ color: 0x645a4f, roughness: 0.78 })
  const screen = new THREE.MeshStandardMaterial({ color: 0x090b0d, roughness: 0.38 })
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff4df,
    emissive: 0xffdf9b,
    emissiveIntensity: 3.4,
    roughness: 0.16
  })
  const suit = new THREE.MeshStandardMaterial({ color: 0x20252b, roughness: 0.82 })
  const suitLight = new THREE.MeshStandardMaterial({ color: 0x343a42, roughness: 0.78 })
  const shirt = new THREE.MeshStandardMaterial({ color: 0xd9d3c8, roughness: 0.74 })
  const tie = new THREE.MeshStandardMaterial({ color: 0x74453d, roughness: 0.7 })
  const skin = new THREE.MeshStandardMaterial({ color: 0xb98b6c, roughness: 0.8 })
  const shoe = new THREE.MeshStandardMaterial({ color: 0x111315, roughness: 0.72 })

  const torso = new THREE.Group()
  torso.position.y = -0.5
  character.add(torso)
  torso.add(createBox(2.05, 2.2, 0.94, suit, [0, 0, 0]))
  torso.add(createBox(0.58, 1.86, 0.08, shirt, [0, 0.04, 0.52]))

  const leftLapels = createBox(0.5, 1.45, 0.08, suitLight, [-0.48, 0.26, 0.58])
  leftLapels.rotation.z = -0.28
  torso.add(leftLapels)
  const rightLapels = createBox(0.5, 1.45, 0.08, suitLight, [0.48, 0.26, 0.58])
  rightLapels.rotation.z = 0.28
  torso.add(rightLapels)

  const tieKnot = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.3, 4), tie)
  tieKnot.position.set(0, 0.72, 0.65)
  tieKnot.rotation.z = Math.PI
  torso.add(tieKnot)
  const tieBody = createBox(0.18, 0.9, 0.08, tie, [0, 0.17, 0.64])
  tieBody.rotation.z = 0.03
  torso.add(tieBody)

  for (const y of [0.25, -0.32, -0.78]) {
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), shellDark)
    button.position.set(0.42, y, 0.52)
    torso.add(button)
  }

  const leftArm = new THREE.Group()
  leftArm.position.set(-1.22, 0.22, 0)
  leftArm.rotation.z = 0.12
  torso.add(leftArm)
  leftArm.add(createLimb(0.31, 1.55, suit, [0, -0.86, 0]))
  leftArm.add(createLimb(0.22, 0.36, skin, [0, -1.95, 0.04]))

  const rightArm = new THREE.Group()
  rightArm.position.set(1.22, 0.22, 0)
  rightArm.rotation.z = -0.12
  torso.add(rightArm)
  rightArm.add(createLimb(0.31, 1.55, suit, [0, -0.86, 0]))
  rightArm.add(createLimb(0.22, 0.36, skin, [0, -1.95, 0.04]))

  const hips = createBox(1.72, 0.52, 0.76, suit, [0, -1.77, 0])
  character.add(hips)

  const leftLeg = new THREE.Group()
  leftLeg.position.set(-0.48, -2.08, 0)
  character.add(leftLeg)
  leftLeg.add(createLimb(0.35, 1.52, suit, [0, -0.78, 0]))
  const leftShoe = createBox(0.68, 0.36, 1.0, shoe, [0, -1.82, 0.15])
  leftShoe.rotation.x = -0.08
  leftLeg.add(leftShoe)

  const rightLeg = new THREE.Group()
  rightLeg.position.set(0.48, -2.08, 0)
  character.add(rightLeg)
  rightLeg.add(createLimb(0.35, 1.52, suit, [0, -0.78, 0]))
  const rightShoe = createBox(0.68, 0.36, 1.0, shoe, [0, -1.82, 0.15])
  rightShoe.rotation.x = -0.08
  rightLeg.add(rightShoe)

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 0.52, 24), shellDark)
  neck.position.set(0, 0.83, 0)
  character.add(neck)

  const head = new THREE.Group()
  head.position.set(0, 1.04, 0)
  character.add(head)

  const computer = new THREE.Group()
  computer.position.y = 1.08
  head.add(computer)
  computer.add(createBox(2.15, 1.92, 1.7, shell, [0, 0, 0]))
  computer.add(createBox(1.86, 1.12, 0.13, shellDark, [0, 0.22, 0.9]))
  computer.add(createBox(1.62, 0.9, 0.08, screen, [0, 0.23, 1.01]))
  computer.add(createBox(1.85, 0.46, 0.14, shell, [0, -0.67, 0.91]))
  computer.add(createBox(0.72, 0.07, 0.05, screen, [0.3, -0.63, 1.02]))

  const eyes: THREE.Mesh[] = []
  const eyeGeometry = new THREE.SphereGeometry(0.2, 28, 20)
  for (const x of [-0.42, 0.42]) {
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    eye.position.set(x, 0.24, 1.1)
    eye.scale.set(0.72, 1.15, 0.2)
    computer.add(eye)
    eyes.push(eye)
  }

  const ventMaterial = new THREE.MeshStandardMaterial({ color: 0x292725, roughness: 0.84 })
  for (let index = 0; index < 4; index += 1) {
    computer.add(createBox(1.02, 0.026, 0.026, ventMaterial, [0, 0.35 - index * 0.11, -0.86]))
  }

  scene.add(new THREE.HemisphereLight(0xd7e3ef, 0x15171a, 2.35))
  const keyLight = new THREE.DirectionalLight(0xffdfb7, 4.4)
  keyLight.position.set(-4, 6, 6)
  scene.add(keyLight)
  const rimLight = new THREE.DirectionalLight(0x7fa6c8, 3)
  rimLight.position.set(5, 3, -4)
  scene.add(rimLight)

  const handlePointerMove = (event: PointerEvent) => {
    const horizontalLimit = THREE.MathUtils.degToRad(65)
    targetRotationY = (event.clientX / window.innerWidth * 2 - 1) * horizontalLimit
    targetRotationX = (event.clientY / window.innerHeight * 2 - 1) * 0.18
  }

  const resize = () => {
    if (!canvas.value || !renderer) return
    const { clientWidth, clientHeight } = canvas.value
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }

  const clock = new THREE.Clock()
  const render = () => {
    const elapsed = clock.getElapsedTime()
    head.rotation.y += (targetRotationY - head.rotation.y) * 0.024
    head.rotation.x += (targetRotationX - head.rotation.x) * 0.024
    character.position.y = Math.sin(elapsed * 1.7) * 0.055
    torso.rotation.z = Math.sin(elapsed * 1.25) * 0.012
    leftArm.rotation.x = Math.sin(elapsed * 1.25) * 0.055
    rightArm.rotation.x = -Math.sin(elapsed * 1.25) * 0.055
    leftLeg.rotation.x = -Math.sin(elapsed * 1.25) * 0.018
    rightLeg.rotation.x = Math.sin(elapsed * 1.25) * 0.018
    const blink = Math.max(0.08, 1 - Math.max(0, Math.sin(elapsed * 0.72) - 0.985) * 65)
    eyes.forEach((eye) => { eye.scale.y = 1.15 * blink })
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
