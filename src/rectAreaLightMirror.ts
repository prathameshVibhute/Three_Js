import * as THREE from 'three';
import { OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/Addons.js';
import { setBeforeRouteChange } from './router';
import type { SIZE } from './size';

// Canvas
const canvas: HTMLCanvasElement | null = document.querySelector('#webgl');
RectAreaLightUniformsLib.init();    // Without this code object will not shine

// Scene
const scene: THREE.Scene = new THREE.Scene();
let renderer!: THREE.WebGLRenderer; 
if(canvas) {
    renderer = new THREE.WebGLRenderer({canvas});
}

// Mesh
const geometry: THREE.TorusKnotGeometry = new THREE.TorusKnotGeometry( 1.2, 0.4, 100, 16 );
const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
material.roughness = 0;
material.metalness = 0;
const torusKnotGeometryMesh: THREE.Mesh = new THREE.Mesh(geometry,material);
scene.add(torusKnotGeometryMesh);

const boxGeometry: THREE.BoxGeometry = new THREE.BoxGeometry( 2000, 0.1, 2000 );
// Dark colored material will make the reflection more visible and light will be shown dim
const boxMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
boxMaterial.roughnessMap = createCheckerTexture(400);
const boxMesh: THREE.Mesh = new THREE.Mesh(boxGeometry,boxMaterial);
boxMesh.position.y = -6;
scene.add(boxMesh);

function createCheckerTexture(repeat: number = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;

    const ctx: any = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 2, 2);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillRect(1, 1, 1, 1);
    console.log(ctx);

    const texture = new THREE.CanvasTexture(canvas);
    texture.repeat.set(repeat, repeat);
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

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
camera.position.z = -25;
camera.lookAt(torusKnotGeometryMesh.position);
scene.add(camera);

// Light
const rectAreaLightBlueColor: THREE.RectAreaLight = new THREE.RectAreaLight(0x0000ff,5,4,10);
rectAreaLightBlueColor.position.set(5,0,5);
scene.add(rectAreaLightBlueColor);

const rectAreaLightHelperBlueColor: RectAreaLightHelper = new RectAreaLightHelper(rectAreaLightBlueColor);
rectAreaLightBlueColor.add(rectAreaLightHelperBlueColor);

const rectAreaLightGreenColor: THREE.RectAreaLight = new THREE.RectAreaLight(0x01ff00,5,4,10);
rectAreaLightGreenColor.position.set(0,0,5);
scene.add(rectAreaLightGreenColor);

const rectAreaLightHelperGreenColor: RectAreaLightHelper = new RectAreaLightHelper(rectAreaLightGreenColor);
rectAreaLightGreenColor.add(rectAreaLightHelperGreenColor);

const rectAreaLightRedColor: THREE.RectAreaLight = new THREE.RectAreaLight(0xff0000,5,4,10);
rectAreaLightRedColor.position.set(-5,0,5);
scene.add(rectAreaLightRedColor);

const rectAreaLightHelperRedColor: RectAreaLightHelper = new RectAreaLightHelper(rectAreaLightRedColor);
rectAreaLightRedColor.add(rectAreaLightHelperRedColor);

const controls: OrbitControls = new OrbitControls(camera, canvas ?? undefined);

renderer.setSize(size.width,size.height);
renderer.render(scene,camera);

const clock = new THREE.Clock();

function rectAreaLightRotationAnimation() {
    const elapsedTime = clock.getElapsedTime();
    rectAreaLightBlueColor.rotation.y = elapsedTime;
    rectAreaLightGreenColor.rotation.y = elapsedTime * 0.5;
    rectAreaLightRedColor.rotation.y = -elapsedTime;
    controls.update();
    renderer.render(scene,camera);
    window.requestAnimationFrame(rectAreaLightRotationAnimation);
}

rectAreaLightRotationAnimation();

setBeforeRouteChange(() => {
    geometry.dispose();
    material.dispose();
    renderer.dispose();
});