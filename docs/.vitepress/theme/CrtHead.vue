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
type PetReaction = 'notice' | 'pet' | 'grab' | 'release'
let activeReaction: PetReaction | null = null
let reactionStartedAt = 0
let reactionIntensity = 0

function react(reaction: PetReaction, intensity = 0.5) {
  activeReaction = reaction
  reactionStartedAt = performance.now() / 1000
  reactionIntensity = intensity
}

defineExpose({ react })

const motionCycle = [
  { name: 'observe', duration: 4.7 },
  { name: 'curious', duration: 3.1 },
  { name: 'listen', duration: 2.3 },
  { name: 'shy', duration: 3.8 },
  { name: 'observe', duration: 2.9 },
  { name: 'happyHop', duration: 3.4 },
  { name: 'scurry', duration: 4.6 },
  { name: 'doze', duration: 5.2 }
] as const

function getMotion(elapsed: number) {
  const total = motionCycle.reduce((sum, motion) => sum + motion.duration, 0)
  let cursor = elapsed % total
  for (const motion of motionCycle) {
    if (cursor <= motion.duration) {
      const phase = cursor / motion.duration
      const weight = Math.sin(Math.PI * phase) ** 2
      return { name: motion.name, phase, weight }
    }
    cursor -= motion.duration
  }
  return { name: 'observe' as const, phase: 0, weight: 0 }
}

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

function createJoint(radius: number, material: THREE.Material) {
  const joint = new THREE.Mesh(new THREE.SphereGeometry(radius, 18, 14), material)
  joint.castShadow = true
  return joint
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
  leftArm.add(createLimb(0.31, 0.62, suit, [0, -0.48, 0]))
  const leftElbow = createJoint(0.3, suit)
  leftElbow.position.y = -0.96
  leftArm.add(leftElbow)
  const leftForearm = new THREE.Group()
  leftForearm.position.y = -0.96
  leftArm.add(leftForearm)
  leftForearm.add(createLimb(0.27, 0.62, suit, [0, -0.46, 0]))
  leftForearm.add(createLimb(0.22, 0.24, skin, [0, -1.02, 0.04]))

  const rightArm = new THREE.Group()
  rightArm.position.set(1.22, 0.22, 0)
  rightArm.rotation.z = -0.12
  torso.add(rightArm)
  rightArm.add(createLimb(0.31, 0.62, suit, [0, -0.48, 0]))
  const rightElbow = createJoint(0.3, suit)
  rightElbow.position.y = -0.96
  rightArm.add(rightElbow)
  const rightForearm = new THREE.Group()
  rightForearm.position.y = -0.96
  rightArm.add(rightForearm)
  rightForearm.add(createLimb(0.27, 0.62, suit, [0, -0.46, 0]))
  rightForearm.add(createLimb(0.22, 0.24, skin, [0, -1.02, 0.04]))

  const hips = createBox(1.72, 0.52, 0.76, suit, [0, -1.77, 0])
  character.add(hips)

  const leftLeg = new THREE.Group()
  leftLeg.position.set(-0.48, -2.08, 0)
  character.add(leftLeg)
  leftLeg.add(createLimb(0.35, 0.58, suit, [0, -0.46, 0]))
  const leftKnee = createJoint(0.33, suit)
  leftKnee.position.y = -0.94
  leftLeg.add(leftKnee)
  const leftShin = new THREE.Group()
  leftShin.position.y = -0.94
  leftLeg.add(leftShin)
  leftShin.add(createLimb(0.31, 0.58, suit, [0, -0.44, 0]))
  const leftShoe = createBox(0.68, 0.36, 1.0, shoe, [0, -1.02, 0.15])
  leftShoe.rotation.x = -0.08
  leftShin.add(leftShoe)

  const rightLeg = new THREE.Group()
  rightLeg.position.set(0.48, -2.08, 0)
  character.add(rightLeg)
  rightLeg.add(createLimb(0.35, 0.58, suit, [0, -0.46, 0]))
  const rightKnee = createJoint(0.33, suit)
  rightKnee.position.y = -0.94
  rightLeg.add(rightKnee)
  const rightShin = new THREE.Group()
  rightShin.position.y = -0.94
  rightLeg.add(rightShin)
  rightShin.add(createLimb(0.31, 0.58, suit, [0, -0.44, 0]))
  const rightShoe = createBox(0.68, 0.36, 1.0, shoe, [0, -1.02, 0.15])
  rightShoe.rotation.x = -0.08
  rightShin.add(rightShoe)

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

  const antenna = new THREE.Group()
  antenna.position.set(0.58, 1.02, 0.1)
  computer.add(antenna)
  const antennaStem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.64, 12), shellDark)
  antennaStem.position.y = 0.3
  antennaStem.rotation.z = -0.18
  antenna.add(antennaStem)
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), eyeMaterial)
  antennaTip.position.set(0.06, 0.64, 0)
  antenna.add(antennaTip)

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
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const render = () => {
    const elapsed = clock.getElapsedTime()
    const motion = reduceMotion.matches
      ? { name: 'observe' as const, phase: 0, weight: 0 }
      : getMotion(elapsed)
    const { name, phase, weight } = motion
    const breathe = reduceMotion.matches ? 0 : Math.sin(elapsed * 1.28)
    const quickBeat = Math.sin(phase * Math.PI * 8)
    const softBeat = Math.sin(phase * Math.PI * 2)
    const tinyNoise = Math.sin(elapsed * 0.73) * Math.sin(elapsed * 1.91)

    let headX = targetRotationX
    let headY = targetRotationY
    let headZ = tinyNoise * 0.012
    let torsoZ = breathe * 0.009
    let torsoX = 0
    let leftArmX = breathe * 0.025
    let rightArmX = -breathe * 0.025
    let leftArmZ = 0.12
    let rightArmZ = -0.12
    let leftForearmZ = 0.04 + breathe * 0.018
    let rightForearmZ = -0.04 - breathe * 0.018
    let leftForearmX = 0
    let rightForearmX = 0
    let leftLegX = -breathe * 0.014
    let rightLegX = breathe * 0.014
    let leftShinX = 0.03
    let rightShinX = 0.03
    let characterX = 0
    let characterY = breathe * 0.025
    let scaleX = 1
    let scaleY = 1
    let eyeMood = 1
    let antennaEnergy = 1

    if (name === 'curious') {
      headZ += (phase < 0.48 ? -0.22 : 0.16) * weight
      headX -= 0.13 * weight
      torsoZ -= 0.035 * weight
      torsoX = 0.08 * weight
      characterX = -0.08 * weight
      leftForearmZ += 0.12 * weight
      rightForearmZ -= 0.12 * weight
      eyeMood = 1.16
    } else if (name === 'listen') {
      headZ += 0.28 * weight
      headY += 0.12 * Math.sign(softBeat || 1) * weight
      leftArmZ -= 0.22 * weight
      rightArmZ += 0.22 * weight
      leftForearmZ += 0.26 * weight
      rightForearmZ -= 0.26 * weight
      eyeMood = 1.25
    } else if (name === 'shy') {
      headX += 0.25 * weight
      headZ -= 0.12 * weight
      torsoX = 0.18 * weight
      leftArmZ -= 0.55 * weight
      rightArmZ += 0.55 * weight
      leftForearmZ += 0.82 * weight
      rightForearmZ -= 0.82 * weight
      leftForearmX -= 0.18 * weight
      rightForearmX -= 0.18 * weight
      leftLegX += 0.08 * weight
      rightLegX -= 0.08 * weight
      leftShinX += 0.18 * weight
      rightShinX += 0.18 * weight
      characterY -= 0.18 * weight
      scaleX += 0.035 * weight
      scaleY -= 0.035 * weight
      eyeMood = 0.72
    } else if (name === 'happyHop') {
      const hop = Math.max(0, Math.sin(phase * Math.PI * 4)) * weight
      const crouch = Math.max(0, 1 - hop * 1.8) * weight
      characterY += hop * 0.34
      scaleX += (0.05 - hop * 0.08) * weight
      scaleY += (hop * 0.1 - 0.04) * weight
      leftArmZ -= (0.5 + quickBeat * 0.08) * weight
      rightArmZ += (0.5 + quickBeat * 0.08) * weight
      leftForearmZ += (0.22 + hop * 0.28) * weight
      rightForearmZ -= (0.22 + hop * 0.28) * weight
      leftLegX -= crouch * 0.42
      rightLegX -= crouch * 0.42
      leftShinX += crouch * 0.82
      rightShinX += crouch * 0.82
      headZ += quickBeat * 0.045 * weight
      eyeMood = 1.18
    } else if (name === 'scurry') {
      const stride = quickBeat * weight
      leftArmX += stride * 0.34
      rightArmX -= stride * 0.34
      leftLegX -= stride * 0.32
      rightLegX += stride * 0.32
      leftShinX += Math.max(0, stride) * 0.48
      rightShinX += Math.max(0, -stride) * 0.48
      leftForearmX -= stride * 0.12
      rightForearmX += stride * 0.12
      torsoX = 0.1 * weight
      torsoZ += stride * 0.02
      characterX = Math.sin(phase * Math.PI * 2) * 0.13 * weight
      characterY += Math.abs(quickBeat) * 0.055 * weight
      headZ -= stride * 0.025
    } else if (name === 'doze') {
      headX += 0.34 * weight
      headZ += 0.13 * weight + Math.sin(elapsed * 0.7) * 0.025 * weight
      torsoX = 0.12 * weight
      characterY -= 0.08 * weight
      leftArmZ -= 0.18 * weight
      rightArmZ += 0.18 * weight
      leftForearmZ += 0.2 * weight
      rightForearmZ -= 0.2 * weight
      leftShinX += 0.12 * weight
      rightShinX += 0.12 * weight
      eyeMood = 0.16
    }

    const reaction = reduceMotion.matches ? null : activeReaction
    const reactionAge = performance.now() / 1000 - reactionStartedAt
    const reactionDuration = reaction === 'notice' ? 1.25 : reaction === 'pet' ? 2.1 : 1.45
    if (reaction && reaction !== 'grab' && reactionAge > reactionDuration) activeReaction = null
    const reactionPhase = THREE.MathUtils.clamp(reactionAge / reactionDuration, 0, 1)
    const reactionWeight = reaction === 'grab' ? 1 : Math.sin(reactionPhase * Math.PI) ** 2

    if (reaction === 'notice') {
      headX -= 0.1 * reactionWeight
      headZ += 0.12 * reactionWeight
      torsoX += 0.05 * reactionWeight
      leftForearmZ += 0.12 * reactionWeight
      rightForearmZ -= 0.12 * reactionWeight
      eyeMood = Math.max(eyeMood, 1 + reactionWeight * 0.38)
      antennaEnergy = 1 + reactionWeight * 0.7
    } else if (reaction === 'pet') {
      const nuzzle = Math.sin(reactionPhase * Math.PI * 5) * reactionWeight
      headX += 0.24 * reactionWeight
      headZ += nuzzle * 0.055 - 0.08 * reactionWeight
      torsoX += 0.11 * reactionWeight
      characterY -= 0.12 * reactionWeight
      characterX += nuzzle * 0.018
      scaleX += 0.035 * reactionWeight
      scaleY -= 0.03 * reactionWeight
      leftArmZ -= 0.2 * reactionWeight
      rightArmZ += 0.2 * reactionWeight
      leftForearmZ += 0.38 * reactionWeight
      rightForearmZ -= 0.38 * reactionWeight
      leftShinX += 0.2 * reactionWeight
      rightShinX += 0.2 * reactionWeight
      eyeMood = Math.min(eyeMood, 1 - reactionWeight * 0.64)
      antennaEnergy = 1 + Math.abs(nuzzle) * 0.34
    } else if (reaction === 'grab') {
      headX -= 0.08
      headZ += Math.sin(elapsed * 2.4) * 0.025
      torsoX -= 0.08
      leftArmX += 0.3
      rightArmX += 0.3
      leftForearmX += 0.22
      rightForearmX += 0.22
      leftLegX += 0.18
      rightLegX += 0.18
      leftShinX += 0.3
      rightShinX += 0.3
      eyeMood = 1.18
      antennaEnergy = 1.35
    } else if (reaction === 'release') {
      const decay = (1 - reactionPhase) * reactionWeight
      const wobble = Math.sin(reactionPhase * Math.PI * 7) * decay * (0.35 + reactionIntensity)
      torsoZ += wobble * 0.16
      headZ -= wobble * 0.11
      characterX += wobble * 0.07
      characterY -= Math.max(0, Math.sin(reactionPhase * Math.PI * 2)) * 0.09 * decay
      leftLegX -= decay * 0.18
      rightLegX -= decay * 0.18
      leftShinX += decay * 0.38
      rightShinX += decay * 0.38
      leftArmZ -= wobble * 0.2
      rightArmZ -= wobble * 0.2
      eyeMood = 1 + Math.abs(wobble) * 0.35
      antennaEnergy = 1 + Math.abs(wobble) * 0.8
    }

    head.rotation.y += (targetRotationY - head.rotation.y) * 0.024
    head.rotation.y += (headY - targetRotationY) * 0.045
    head.rotation.x += (headX - head.rotation.x) * 0.045
    head.rotation.z += (headZ - head.rotation.z) * 0.055
    character.position.x += (characterX - character.position.x) * 0.08
    character.position.y += ((reduceMotion.matches ? 0 : characterY) - character.position.y) * 0.14
    character.scale.x += (scaleX - character.scale.x) * 0.12
    character.scale.y += (scaleY - character.scale.y) * 0.12
    character.scale.z += (scaleX - character.scale.z) * 0.12
    torso.rotation.x += (torsoX - torso.rotation.x) * 0.07
    torso.rotation.z += (torsoZ - torso.rotation.z) * 0.08
    leftArm.rotation.x += (leftArmX - leftArm.rotation.x) * 0.09
    rightArm.rotation.x += (rightArmX - rightArm.rotation.x) * 0.09
    leftArm.rotation.z += (leftArmZ - leftArm.rotation.z) * 0.09
    rightArm.rotation.z += (rightArmZ - rightArm.rotation.z) * 0.09
    leftForearm.rotation.x += (leftForearmX - leftForearm.rotation.x) * 0.105
    rightForearm.rotation.x += (rightForearmX - rightForearm.rotation.x) * 0.105
    leftForearm.rotation.z += (leftForearmZ - leftForearm.rotation.z) * 0.105
    rightForearm.rotation.z += (rightForearmZ - rightForearm.rotation.z) * 0.105
    leftLeg.rotation.x += (leftLegX - leftLeg.rotation.x) * 0.09
    rightLeg.rotation.x += (rightLegX - rightLeg.rotation.x) * 0.09
    leftShin.rotation.x += (leftShinX - leftShin.rotation.x) * 0.11
    rightShin.rotation.x += (rightShinX - rightShin.rotation.x) * 0.11

    const blinkPulse = Math.max(0, Math.sin(elapsed * 0.78) - 0.986) * 72
    antenna.rotation.z = Math.sin(elapsed * 2.1 * antennaEnergy) * 0.045 * antennaEnergy + headZ * 0.7
    antennaTip.scale.setScalar(1 + (eyeMood - 1) * 0.24 + (antennaEnergy - 1) * 0.08)
    eyes.forEach((eye, index) => {
      const staggeredBlink = index === 1 ? blinkPulse * 0.92 : blinkPulse
      eye.scale.x += (0.72 * eyeMood - eye.scale.x) * 0.12
      eye.scale.y = 1.15 * eyeMood * Math.max(0.08, 1 - staggeredBlink)
    })
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
