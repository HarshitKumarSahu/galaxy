import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap/all'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import { SplitText } from 'gsap/SplitText.js'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * Lenis Setup
 */
const lenis = new Lenis({
    duration: 2.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
})

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x1a1a1a, 0, 7)

const group = new THREE.Group()
scene.add(group)

/**
 * Galaxy Configuration
 */
const galaxyInfo1 = {
    particleCount: 100000,
    particleSize: 0.01,
    radius: 5,
    innerRadius: 0.3,
    branches: 2,
    spin: 2.75,
    randomness: 0.25,
    randomnessPower: 3,
    insideColor: "#7d0f25",
    outsideColor: "#1b3984",
    positionX: 0,
    positionY: 0,
    positionZ: 0
}

const galaxyInfo2 = {
    particleCount: 30000,
    particleSize: 0.0075,
    radius: 2,
    innerRadius: 0.275,
    branches: 20,
    spin: 5,
    randomness: 0.25,
    randomnessPower: 3,
    insideColor: "#8c418e",
    outsideColor: "#7d0f25",
    positionX: 0,
    positionY: 0,
    positionZ: 0
}

let galaxyData = [
    { geometry: null, material: null, points: null },
    { geometry: null, material: null, points: null }
]

const galaxyGenerator = (galaxyInfo, galaxyDataIndex) => {
    const data = galaxyData[galaxyDataIndex]

    // Dispose of existing geometry, material, and remove from group
    if (data.points !== null) {
        data.geometry.dispose()
        data.material.dispose()
        group.remove(data.points)
    }

    // Create new geometry
    data.geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(galaxyInfo.particleCount * 3)
    const colors = new Float32Array(galaxyInfo.particleCount * 3)

    const colorInside = new THREE.Color(galaxyInfo.insideColor)
    const colorOutside = new THREE.Color(galaxyInfo.outsideColor)

    for (let i = 0; i < galaxyInfo.particleCount; i++) {
        let i3 = i * 3
        const radius = galaxyInfo.innerRadius + Math.random() * (galaxyInfo.radius - galaxyInfo.innerRadius)
        const spinAngle = radius * galaxyInfo.spin
        const branchAngle = ((i % galaxyInfo.branches) / galaxyInfo.branches) * Math.PI * 2

        const randomX = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo.randomness * radius
        const randomY = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo.randomness * radius
        const randomZ = Math.pow(Math.random(), galaxyInfo.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyInfo.randomness * radius

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX + galaxyInfo.positionX
        positions[i3 + 1] = randomY + galaxyInfo.positionY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ + galaxyInfo.positionZ

        const mixedColor = colorInside.clone()
        const normalizedRadius = (radius - galaxyInfo.innerRadius) / (galaxyInfo.radius - galaxyInfo.innerRadius)
        mixedColor.lerp(colorOutside, normalizedRadius)

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    data.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    data.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    data.material = new THREE.PointsMaterial({
        size: galaxyInfo.particleSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        fog: true
    })

    data.points = new THREE.Points(data.geometry, data.material)
    group.add(data.points)
}

// Generate galaxies
galaxyGenerator(galaxyInfo1, 0)
galaxyGenerator(galaxyInfo2, 1)

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
const startXPos = 7
const endXPos = 0
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(startXPos, 3, 3)
camera.lookAt(0, 0, 0)
scene.add(camera)

// gui.add(camera.position, "x").min(0).max(10)

function landingAnimation(domElem, splitType = "words") {
    gsap.set(domElem, { opacity: 0, top: -domElem.offsetHeight })

    const split = new SplitText(domElem, { 
        type: splitType,
        tag: "span"
    })

    gsap.set(split[splitType], { y: "100%" })

    return gsap.to(split[splitType], {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.05,
        ease: "expo.out",
        onStart: () => gsap.set(domElem, { opacity: 1 }),
        onReverseComplete: () => gsap.set(domElem, { opacity: 0 })
    })
}

// intro animations
const body = document.querySelector("body")
body.style.overflow = "hidden"
const sections = document.querySelectorAll('.section')
const secs = document.querySelectorAll(".sec")

const pSec1 = secs[0].querySelectorAll("p")
const pSec3 = secs[1].querySelectorAll("p")

sections[0].style.display = "none"
sections[1].style.display = "none"
sections[2].style.display = "none"

document.querySelector(".btn").addEventListener("click", () => {
    gsap.to(".btn", {
        opacity: 0,
        display: "none",
        duration: 0.5,
        onComplete: () => {
            sections[0].style.display = "flex"
            sections[1].style.display = "flex"
            sections[2].style.display = "flex"

            sections[0].style.height = "100vh"
            sections[1].style.height = "100vh"
            sections[2].style.height = "100vh"
        }
    })

    gsap.to(camera.position, {
        x: endXPos,
        duration: 1.125,
        ease: "expoScale(0.5,7,none)",
        onComplete: () => {
            body.style.overflow = "auto"

            const tlSec1_0 = landingAnimation(pSec1[0], "words")
            const tlSec1_1 = landingAnimation(pSec1[1], "words")
            const tlSec1_2 = landingAnimation(pSec1[2], "words")
            const tlSec1_3 = landingAnimation(pSec1[3], "words")

            // Scroll-based animations for group rotation and position
            gsap.to(group.rotation, {
                x: Math.PI / 4,
                y: Math.PI * 0.75,
                scrollTrigger: {
                    trigger: sections[0],
                    endTrigger: sections[2],
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    // markers: false
                }
            })
            gsap.to(group.position, {
                y: Math.PI,
                z: Math.PI,
                scrollTrigger: {
                    trigger: sections[0],
                    endTrigger: sections[2],
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1
                }
            })

            // ScrollTrigger for section 1 animations with reverse
            gsap.to(pSec1[0], {
                scrollTrigger: {
                    trigger: sections[0],
                    start: 'top -70%',
                    toggleActions: 'play reverse reverse reverse',
                    // markers: false
                    onEnter: () => {
                        gsap.to(pSec1, { opacity: 0 })
                    },
                    onEnterBack: () => {
                        gsap.to(pSec1, { opacity: 1 })
                        tlSec1_0.play()
                        tlSec1_1.play()
                        tlSec1_2.play()
                        tlSec1_3.play()
                    }
                }
            })

            // ScrollTrigger for section 3 animations with reverse
            gsap.to(pSec3[0], {
                scrollTrigger: {
                    trigger: sections[2],
                    start: 'top 50%',
                    end: 'bottom 110%',
                    toggleActions: 'play reverse reverse reverse',
                    // markers: true
                    onEnter: () => {
                        const tlSec3_0 = landingAnimation(pSec3[0], "words")
                        const tlSec3_1 = landingAnimation(pSec3[1], "words")
                        const tlSec3_2 = landingAnimation(pSec3[2], "words")
                        const tlSec3_3 = landingAnimation(pSec3[3], "words")
                        gsap.to(pSec3, { opacity: 1 })
                    },
                    onEnterBack: () => {
                        gsap.to(pSec3, { opacity: 0 })
                        tlSec1_0.play();
                        tlSec1_1.play();
                        tlSec1_2.play();
                        tlSec1_3.play();
                    }
                }
            })
        }
    })
})

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    galaxyData[0].points.rotation.y = elapsedTime * 0.1
    galaxyData[1].points.rotation.y = elapsedTime * 0.1
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()