import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';
import { setBeforeRouteChange } from './router';

const canvas: any  = document.querySelector('#webgl');
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({canvas});
const scene: THREE.Scene = new THREE.Scene();

const gui = new dat.GUI();

interface SIZE {
    width: number,
    height: number
}

let particleGeometry!: THREE.BufferGeometry;
let particleMaterial!: THREE.PointsMaterial;
let particleWaveMesh!: THREE.Points;

function makeParticle() {

    if(particleWaveMesh) {
        particleGeometry.dispose();
        particleMaterial.dispose();
        scene.remove(particleWaveMesh);
    }

    let length: number = -waveParameters.length;
    let width: number = -waveParameters.width;

    let particleAttribute: any = new Float32Array(1000000);
    let colorArray: any = new Float32Array(1000000);
    let leftColor = new THREE.Color(waveParameters.leftColor);
    let rightColor = new THREE.Color(waveParameters.rightColor);
    for(let i = 0; ; i++) {
        if(Math.round(length) === waveParameters.length) {
            length = -waveParameters.length;
            width += waveParameters.gap;
        }
        if(Math.round(width) === waveParameters.width) {
            break;
        }
        let index = i * 3;
        let xAxis: number = length;
        let yAxis: number = 0;
        let zAxis: number = width;
        let mixedColor = new THREE.Color(leftColor).clone();
        mixedColor.lerp(rightColor,normalize(length,-waveParameters.length,waveParameters.length));
        colorArray[index] = mixedColor.r
        colorArray[index + 1] = mixedColor.g
        colorArray[index + 2] = mixedColor.b
        particleAttribute[index] = xAxis;
        particleAttribute[index + 1] = yAxis;
        particleAttribute[index + 2] = zAxis;
        length += waveParameters.gap;
    }

    function normalize(value: number, min: number, max: number) {
        return (value - min) / (max - min);
    }

    const bufferAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(particleAttribute,3);
    const colorAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(colorArray,3);
    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position',bufferAttribute);
    particleGeometry.setAttribute('color',colorAttribute);
    particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    particleWaveMesh = new THREE.Points(particleGeometry,particleMaterial);
    scene.add(particleWaveMesh);
}

let waveParameters: any = {
    length: 8,
    width: 8,
    gap: 0.1,
    leftColor: 0xff0000,
    rightColor: 0x2d44b9,
    waveMovementSpeed: 2,
    waveFormation: 1,
}

makeParticle();

gui.add(waveParameters,'length').min(1).max(15).step(1).onFinishChange(makeParticle);
gui.add(waveParameters,'width').min(1).max(15).step(1).onFinishChange(makeParticle);
gui.add(waveParameters,'gap').min(0.01).max(1).step(0.1).onFinishChange(makeParticle);
gui.addColor(waveParameters,'leftColor').onFinishChange(makeParticle);
gui.addColor(waveParameters,'rightColor').onFinishChange(makeParticle);
gui.add(waveParameters,'waveMovementSpeed').min(1).max(10).step(0.1);
gui.add(waveParameters,'waveMovementSpeed').min(1).max(10).step(0.1);
gui.add(waveParameters,'waveFormation').min(0).max(10).step(0.1);

// Size
function getSize(): SIZE {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    }
}

let axesHelper: THREE.AxesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const size: SIZE = getSize();
const aspectRatio = size.width / size.height;
const fieldOfView = 45;

// Camera
const camera: THREE.PerspectiveCamera | null = new THREE.PerspectiveCamera(fieldOfView,aspectRatio);
camera.position.z = 10;
scene.add(camera);

const controls: OrbitControls = new OrbitControls(camera,canvas);

const clock = new THREE.Clock();

function waveAnimation() {
    let length = particleWaveMesh.geometry.attributes.position.array.length;
    let elapsedTime = clock.getElapsedTime() / waveParameters.waveMovementSpeed;
    for(let i = 0; i < length / 3; i++) {
        let index = i * 3;
        particleWaveMesh.geometry.attributes.position.array[index + 1] = Math.sin(elapsedTime + particleWaveMesh.geometry.attributes.position.array[index]) + Math.sin(elapsedTime + particleWaveMesh.geometry.attributes.position.array[index + 2]) / waveParameters.waveFormation
    }
    particleWaveMesh.geometry.attributes.position.needsUpdate = true;
}

function animation() {
    waveAnimation();
    controls.update();
    window.requestAnimationFrame(animation);
    renderer.render(scene,camera as THREE.PerspectiveCamera);
}

animation();

renderer.setSize(size.width,size.height);
renderer.render(scene,camera);

setBeforeRouteChange(() => {
    particleGeometry.dispose();
    particleMaterial.dispose();
    axesHelper.dispose();
    renderer.dispose();
    gui.destroy();
});
