import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';
import { setBeforeRouteChange } from './router';
import type { SIZE } from './size';

// Canvas
const canvas: HTMLCanvasElement | null = document.querySelector('#webgl');

// Scene
const scene: THREE.Scene = new THREE.Scene();
let renderer!: THREE.WebGLRenderer;
if(canvas) {
    renderer = new THREE.WebGLRenderer({canvas});
}

let debug: dat.GUI = new dat.GUI();

let bufferGoeometry!: THREE.BufferGeometry;
let pointMaterial!: THREE.PointsMaterial;
let galaxy!: THREE.Points;

function galaxyGenerator() {
    if(galaxy) {
        bufferGoeometry.dispose();
        pointMaterial.dispose();
        scene.remove(galaxy);
    }

    let particalArray: Float32Array = new Float32Array(galaryParamater.particalCount * 3);
    let colorArray: Float32Array = new Float32Array(galaryParamater.particalCount * 3);
    let innerColor: THREE.Color = new THREE.Color(galaryParamater.galaxyInnerColor)
    let outerColor: THREE.Color = new THREE.Color(galaryParamater.galaxyOuterColor)
    
    for(let i = 0; i < galaryParamater.particalCount; i++) {
        let index = i * 3;
        const radius = Math.random() * galaryParamater.galaxyRadius; // Radius of single partical
        const spinAngle: number = galaryParamater.galaxySpin * radius; // Spin angle * partical radius[partical position]
        const branchAngle: number = (i % galaryParamater.galaxyBranch) / galaryParamater.galaxyBranch * Math.PI * 2;
        if(i < 20) {
            console.log(i,spinAngle);
        }
        
        // Without using randomNess power
        // let randomX: number = (Math.random() - 0.5) * galaryParamater.randomness;
        // let randomY: number = (Math.random() - 0.5) * galaryParamater.randomness;
        // let randomZ: number = (Math.random() - 0.5) * galaryParamater.randomness;
        
        // Using randomNess power
        let randomX: number = Math.pow(Math.random(),galaryParamater.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        let randomY: number = Math.pow(Math.random(),galaryParamater.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        let randomZ: number = Math.pow(Math.random(),galaryParamater.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        
        let xAxis = Math.cos(branchAngle + spinAngle) * radius + randomX;
        let yAxis = randomY;
        // Add this code to see christman tree effect using particals
        // let yAxis = -(Math.cos(branchAngle) * radius + randomY) * 2;
        let zAxis = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        particalArray[index + 0] = xAxis;
        particalArray[index + 1] = yAxis;
        particalArray[index + 2] = zAxis;
        
        let mixedColor = new THREE.Color(innerColor).clone();
        mixedColor.lerp(outerColor,radius / galaryParamater.galaxyRadius);
        colorArray[index + 0] = mixedColor.r;
        colorArray[index + 1] = mixedColor.g;
        colorArray[index + 2] = mixedColor.b;
    }

    // Creating Buffer geometry
    let bufferAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(particalArray,3);
    let colorAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(colorArray,3);
    bufferGoeometry = new THREE.BufferGeometry();
    bufferGoeometry.setAttribute('position',bufferAttribute);
    bufferGoeometry.setAttribute('color',colorAttribute);
    pointMaterial = new THREE.PointsMaterial({
        sizeAttenuation: true,
        size: galaryParamater.size,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });
    galaxy = new THREE.Points(bufferGoeometry,pointMaterial);
    scene.add(galaxy);
}

const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const galaryParamater: {
    particalCount: number,
    size: number,
    galaxyRadius: number,
    galaxyBranch: number,
    galaxySpin: number,
    randomness: number,
    randomnessPower: number,
    galaxyInnerColor: number,
    galaxyOuterColor: number
} = {
    particalCount: 100000,
    size: 0.01,
    galaxyRadius: 5,
    galaxyBranch: 3,
    galaxySpin: 1.2,
    randomness: 0.02,
    randomnessPower: 3,
    galaxyInnerColor: 0xff0000,
    galaxyOuterColor: 0x2d44b9,
}

galaxyGenerator();

/**
 * Note i was thinking to use onChange which will call the galaxyGenerator() after single count change, but onFinishGenerator
 * gets call when we finish changing the value
 */
debug.add(galaryParamater,'particalCount').min(1000).max(100000).step(100).onFinishChange(galaxyGenerator);
debug.add(galaryParamater,'size').min(0.02).max(1).step(0.001).onFinishChange(galaxyGenerator);
debug.add(galaryParamater,'galaxyRadius').min(0.01).max(20).step(0.01).onFinishChange(galaxyGenerator);
debug.add(galaryParamater,'galaxyBranch').min(3).max(10).step(1).onFinishChange(galaxyGenerator);
debug.add(galaryParamater,'galaxySpin').min(-5).max(5).step(0.001).onFinishChange(galaxyGenerator);
debug.add(galaryParamater,'randomness').min(-5).max(5).step(0.001).onFinishChange(galaxyGenerator);
debug.add(galaryParamater,'randomnessPower').min(1).max(10).step(0.001).onFinishChange(galaxyGenerator);
debug.addColor(galaryParamater,'galaxyInnerColor').onFinishChange(galaxyGenerator);
debug.addColor(galaryParamater,'galaxyOuterColor').onFinishChange(galaxyGenerator);

// Size
function getSize(): SIZE {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    }
}

const size: SIZE = getSize();

// Camera
const fieldOfView: number = 45;
const aspectRatio: number = size.width / size.height;
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(fieldOfView,aspectRatio);
camera.position.z = 10;
camera.position.y = 10;
camera.lookAt(galaxy.position);
scene.add(camera);

const controls: OrbitControls = new OrbitControls(camera, canvas ?? undefined);

renderer.setSize(size.width,size.height);
renderer.render(scene,camera);

const clock: THREE.Clock = new THREE.Clock();

function rotateGalaxy() {
    galaxy.rotation.y = clock.getElapsedTime() * 0.05;
    controls.update();
    renderer.render(scene,camera);
    window.requestAnimationFrame(rotateGalaxy);
}

rotateGalaxy();

setBeforeRouteChange(() => {
    bufferGoeometry.dispose();
    pointMaterial.dispose();
    axesHelper.dispose();
    renderer.dispose();
    debug.destroy();
});