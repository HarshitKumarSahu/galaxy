import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a1a)
scene.fog = new THREE.Fog(0x1a1a1a, 0, 7)

// Group to hold galaxies
const group = new THREE.Group()
scene.add(group)

/**
 * Galaxy 1
 */
const galaxyInfo1 = {
    particleCount: 100000,
    particleSize: 0.01,
    radius: 5,
    innerRadius: 0.25,
    branches: 2,
    spin: 2.75,
    randomness: 0.25,
    randomnessPower: 3,
    insideColor: "#ff5588",
    outsideColor: "#00fbff",
}

let galaxyGeometry1 = null
let galaxyMaterial1 = null
let galaxy1 = null

const galaxyGenerator1 = () => {
    if (galaxy1 !== null) {
        galaxyGeometry1.dispose()
        galaxyMaterial1.dispose()
        group.remove(galaxy1)
    }

    galaxyGeometry1 = new THREE.BufferGeometry()
    const positions = new Float32Array(galaxyInfo1.particleCount * 3)
    const colors = new Float32Array(galaxyInfo1.particleCount * 3)

    const colorInside = new THREE.Color(galaxyInfo1.insideColor)
    const colorOutside = new THREE.Color(galaxyInfo1.outsideColor)

    for (let i = 0; i < galaxyInfo1.particleCount; i++) {
        let i3 = i * 3
        const radius = galaxyInfo1.innerRadius + Math.random() * (galaxyInfo1.radius - galaxyInfo1.innerRadius)
        const spinAngle = radius * galaxyInfo1.spin
        const branchAngle = ((i % galaxyInfo1.branches) / galaxyInfo1.branches) * Math.PI * 2

        const randomX = Math.pow(Math.random(), galaxyInfo1.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo1.randomness * radius
        const randomY = Math.pow(Math.random(), galaxyInfo1.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo1.randomness * radius
        const randomZ = Math.pow(Math.random(), galaxyInfo1.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo1.randomness * radius

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        const mixedColor = colorInside.clone()
        const normalizedRadius = (radius - galaxyInfo1.innerRadius) / (galaxyInfo1.radius - galaxyInfo1.innerRadius)
        mixedColor.lerp(colorOutside, normalizedRadius)

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    galaxyGeometry1.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    galaxyGeometry1.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    galaxyMaterial1 = new THREE.PointsMaterial({
        size: galaxyInfo1.particleSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        fog: true
    })

    galaxy1 = new THREE.Points(galaxyGeometry1, galaxyMaterial1)
    group.add(galaxy1)
}

galaxyGenerator1()

/**
 * Galaxy 2
 */
const galaxyInfo2 = {
    particleCount: 80000,
    particleSize: 0.015,
    radius: 4,
    innerRadius: 0.3,
    branches: 3,
    spin: -2.0,
    randomness: 0.3,
    randomnessPower: 2.5,
    insideColor: "#88ff55",
    outsideColor: "#ff00ff",
    positionX: 2,
    positionY: 0,
    positionZ: 2
}

let galaxyGeometry2 = null
let galaxyMaterial2 = null
let galaxy2 = null

const galaxyGenerator2 = () => {
    if (galaxy2 !== null) {
        galaxyGeometry2.dispose()
        galaxyMaterial2.dispose()
        group.remove(galaxy2)
    }

    galaxyGeometry2 = new THREE.BufferGeometry()
    const positions = new Float32Array(galaxyInfo2.particleCount * 3)
    const colors = new Float32Array(galaxyInfo2.particleCount * 3)

    const colorInside = new THREE.Color(galaxyInfo2.insideColor)
    const colorOutside = new THREE.Color(galaxyInfo2.outsideColor)

    for (let i = 0; i < galaxyInfo2.particleCount; i++) {
        let i3 = i * 3
        const radius = galaxyInfo2.innerRadius + Math.random() * (galaxyInfo2.radius - galaxyInfo2.innerRadius)
        const spinAngle = radius * galaxyInfo2.spin
        const branchAngle = ((i % galaxyInfo2.branches) / galaxyInfo2.branches) * Math.PI * 2

        const randomX = Math.pow(Math.random(), galaxyInfo2.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo2.randomness * radius
        const randomY = Math.pow(Math.random(), galaxyInfo2.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo2.randomness * radius
        const randomZ = Math.pow(Math.random(), galaxyInfo2.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo2.randomness * radius

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX + galaxyInfo2.positionX
        positions[i3 + 1] = randomY + galaxyInfo2.positionY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ + galaxyInfo2.positionZ

        const mixedColor = colorInside.clone()
        const normalizedRadius = (radius - galaxyInfo2.innerRadius) / (galaxyInfo2.radius - galaxyInfo2.innerRadius)
        mixedColor.lerp(colorOutside, normalizedRadius)

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    galaxyGeometry2.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    galaxyGeometry2.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    galaxyMaterial2 = new THREE.PointsMaterial({
        size: galaxyInfo2.particleSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        fog: true
    })

    galaxy2 = new THREE.Points(galaxyGeometry2, galaxyMaterial2)
    group.add(galaxy2)
}

galaxyGenerator2()

/**
 * GSAP Animation
 */
gsap.to(group.rotation, {
    x: Math.PI / 2,
    duration: 4,
    delay: 1
})
gsap.to(group.position, {
    z: 3.125,
    duration: 4,
    delay: 1
})

/**
 * Gui
 */
const gui = new GUI()

// Galaxy 1 Controls
const galaxy1Folder = gui.addFolder('Galaxy 1')
galaxy1Folder.add(galaxyInfo1, 'particleCount').min(10000).max(500000).step(10000).onFinishChange(galaxyGenerator1)
galaxy1Folder.add(galaxyInfo1, 'particleSize').min(0.001).max(0.05).step(0.001).onFinishChange(galaxyGenerator1)
galaxy1Folder.add(galaxyInfo1, 'radius').min(1).max(20).step(1).onFinishChange(galaxyGenerator1)
galaxy1Folder.add(galaxyInfo1, 'innerRadius').min(0).max(20).step(0.1).onFinishChange(galaxyGenerator1)
galaxy1Folder.add(galaxyInfo1, 'branches').min(1).max(20).step(1).onFinishChange(galaxyGenerator1)
galaxy1Folder.add(galaxyInfo1, 'spin').min(-5).max(5).step(0.0001).onFinishChange(galaxyGenerator1)
galaxy1Folder.add(galaxyInfo1, 'randomness').min(0).max(2.5).step(0.0001).onFinishChange(galaxyGenerator1)
galaxy1Folder.add(galaxyInfo1, 'randomnessPower').min(0).max(10).step(0.0001).onFinishChange(galaxyGenerator1)
galaxy1Folder.addColor(galaxyInfo1, 'insideColor').onFinishChange(galaxyGenerator1)
galaxy1Folder.addColor(galaxyInfo1, 'outsideColor').onFinishChange(galaxyGenerator1)

// Galaxy 2 Controls
const galaxy2Folder = gui.addFolder('Galaxy 2')
galaxy2Folder.add(galaxyInfo2, 'particleCount').min(10000).max(500000).step(10000).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'particleSize').min(0.001).max(0.05).step(0.001).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'radius').min(1).max(20).step(1).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'innerRadius').min(0).max(20).step(0.1).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'branches').min(1).max(20).step(1).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'spin').min(-5).max(5).step(0.0001).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'randomness').min(0).max(2.5).step(0.0001).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'randomnessPower').min(0).max(10).step(0.0001).onFinishChange(galaxyGenerator2)
galaxy2Folder.addColor(galaxyInfo2, 'insideColor').onFinishChange(galaxyGenerator2)
galaxy2Folder.addColor(galaxyInfo2, 'outsideColor').onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'positionX').min(-10).max(10).step(0.1).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'positionY').min(-10).max(10).step(0.1).onFinishChange(galaxyGenerator2)
galaxy2Folder.add(galaxyInfo2, 'positionZ').min(-10).max(10).step(0.1).onFinishChange(galaxyGenerator2)

// Fog Controls
const fogFolder = gui.addFolder('Fog')
fogFolder.addColor({ color: '#1a1a1a' }, 'color').onChange((value) => {
    scene.fog.color.set(value)
    scene.background.set(value)
})
fogFolder.add(scene.fog, 'near').min(0).max(10).step(0.1)
fogFolder.add(scene.fog, 'far').min(5).max(50).step(0.1)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()