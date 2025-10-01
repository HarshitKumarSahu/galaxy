import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
// scene.add(cube)

/**
 * Galaxy
 */
const galaxyInfo = {
    particleCount: 100000,
    particleSize: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.25,
    randomnessPower: 3,
    insideColor: "#ff5588",
    outsideColor: "#00fbff",
}

let galaxyGeometry = null
let galaxyMaterial = null
let galaxy = null

const galaxyGenerator = () => {

    //Dispose and remove old galaxy
    if(galaxy !== null) {
        galaxyGeometry.dispose()
        galaxyMaterial.dispose()
        scene.remove(galaxy)
    }

    //Geometry
    galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyInfo.particleCount * 3);
    const colors = new Float32Array(galaxyInfo.particleCount * 3);

    const colorInside = new THREE.Color(galaxyInfo.insideColor)
    const colorOutside = new THREE.Color(galaxyInfo.outsideColor)

    for (let i = 0; i < galaxyInfo.particleCount ; i++) {
        
        let i3 = i * 3
        
        //position
        const radius = Math.random() * galaxyInfo.radius
        const spinAngle = radius * galaxyInfo.spin
        const branchAngle = ((i % galaxyInfo.branches) / galaxyInfo.branches) * Math.PI * 2

        const randomX = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        // const randomX = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo.randomness * radius
        // const randomY = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo.randomness * radius
        // const randomZ = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo.randomness * radius

        positions[i3 + 0] = Math.cos(branchAngle - spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle - spinAngle) * radius + randomZ

        //colors
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / galaxyInfo.radius)

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    
    //Material
    galaxyMaterial = new THREE.PointsMaterial({
        size: galaxyInfo.particleSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,

    })

    //Galaxy
    galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);

    scene.add(galaxy)
}

galaxyGenerator()

/**
 * Gui
 */
// Debug
const gui = new GUI()

//Galaxy
gui.add(galaxyInfo, 'particleCount').min(100).max(1000000).step(100).onFinishChange(galaxyGenerator)
gui.add(galaxyInfo, 'particleSize').min(0.001).max(0.1).step(0.001).onFinishChange(galaxyGenerator)
gui.add(galaxyInfo, 'radius').min(1).max(20).step(1).onFinishChange(galaxyGenerator)
gui.add(galaxyInfo, 'branches').min(1).max(20).step(1).onFinishChange(galaxyGenerator)
gui.add(galaxyInfo, 'spin').min(-5).max(5).step(0.0001).onFinishChange(galaxyGenerator)
gui.add(galaxyInfo, 'randomness').min(0).max(2.5).step(0.0001).onFinishChange(galaxyGenerator)
gui.add(galaxyInfo, 'randomnessPower').min(0).max(10).step(0.0001).onFinishChange(galaxyGenerator)
gui.addColor(galaxyInfo, 'insideColor').onFinishChange(galaxyGenerator)
gui.addColor(galaxyInfo, 'outsideColor').onFinishChange(galaxyGenerator)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

