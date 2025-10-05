import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
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
 * Galaxy 1
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
}

let galaxyGeometry1 = null
let galaxyMaterial1 = null
let galaxy1 = null

const galaxyGenerator1 = () => {
    if(galaxy1 !== null) {
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

let galaxyGeometry2 = null
let galaxyMaterial2 = null
let galaxy2 = null

const galaxyGenerator2 = () => {
    if(galaxy2 !== null) {
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
 * Gui
 */
const gui = new GUI()

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

gui.add(camera.position, "x").min(0).max(10)

function landingAnimation(domElem, splitType = "words") {
    gsap.set(domElem, { opacity: 0, top: -domElem.offsetHeight })

    const split = new SplitText(domElem, { 
        type: splitType,
        tag: "span"
    })

    gsap.set(split[splitType], { y: "100%" })

    const tl = gsap.timeline()
    tl.to(split[splitType], {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.05,
        ease: "expo.out",
        onStart: () => gsap.set(domElem, { opacity: 1 })
    })

    return tl
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

            // Create a timeline for section 1 animations to make them reversible
            const sec1Timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sections[0],
                    start: 'top top',
                    end: 'top 30%',
                    scrub: true,
                    toggleActions: 'play none none reverse', // Reverse on scroll back
                    markers: true, // Set to false in production
                }
            })

            // Add opacity animation for secs[0]
            sec1Timeline.to(secs[0], {
                opacity: 0,
                duration: 1,
                ease: "power2.inOut"
            })

            // Add text animations for pSec1[0] and pSec1[1]
            sec1Timeline.add(landingAnimation(pSec1[0], "words"), 0)
            sec1Timeline.add(landingAnimation(pSec1[1], "words"), 0)

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
                    markers: true, // Set to false in production
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
                    scrub: 1,
                }
            })

            // Separate ScrollTrigger for section 3 animations at 50% visibility
            gsap.to(pSec3[0], {
                scrollTrigger: {
                    trigger: sections[2],
                    start: 'top 30%', // Trigger when top of section 2 is at 50% of viewport height
                    toggleActions: 'play none none reverse', // Reverse on scroll back
                    markers: true, // Set to false in production
                    onEnter: () => {
                        landingAnimation(pSec3[1], "words")
                        landingAnimation(pSec3[0], "words")
                    }
                }
            })
        }
    })
})

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
    galaxy1.rotation.y = elapsedTime * 0.1
    galaxy2.rotation.y = elapsedTime * 0.1
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()