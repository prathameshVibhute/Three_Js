import * as THREE from 'three';
import type { SIZE } from './size';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { setBeforeRouteChange } from './router';

const scene = new THREE.Scene();
const canvas: any = document.querySelector('#webgl');
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({canvas});

// Size
function getSize(): SIZE {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    }
}

// const sphere
const sphereGeometry1: THREE.SphereGeometry = new THREE.SphereGeometry( 1.2, 32, 16 );
const material1: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
const sphereGeometry2: THREE.SphereGeometry = new THREE.SphereGeometry( 1.2, 32, 16 );
const material2: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
const sphereGeometry3: THREE.SphereGeometry = new THREE.SphereGeometry( 1.2, 32, 16 );
const material3: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});

const sphereMesh1: THREE.Mesh = new THREE.Mesh(sphereGeometry1,material1);
sphereMesh1.position.x = -5;
scene.add(sphereMesh1);
const sphereMesh2: THREE.Mesh = new THREE.Mesh(sphereGeometry2,material2);
scene.add(sphereMesh2);
const sphereMesh3: THREE.Mesh = new THREE.Mesh(sphereGeometry3,material3);
sphereMesh3.position.x = 5;
scene.add(sphereMesh3);

const size: SIZE = getSize();
const fieldOfView: number = 45;
const aspectRatio: number = size.width / size.height;
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(fieldOfView,aspectRatio);
camera.position.z = 15;
scene.add(camera);

renderer.setSize(size.width,size.height);
renderer.render(scene,camera);


const controls: OrbitControls = new OrbitControls(camera,canvas);

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event: any) => {
    mouse.x = ((event.clientX * 2) / size.width) - 1;
    mouse.y = -(((event.clientY * 2) / size.height) - 1);
});
    
const rayCaster = new THREE.Raycaster();

/**
 * Use this when we want a ray from specific direction
 */
// const origin = new THREE.Vector3(-8, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();
// rayCaster.set(origin, rayDirection);

const objects: any = [sphereMesh1,sphereMesh2,sphereMesh3];

const clock = new THREE.Clock();

// When you want to pass ray
function getRay() {
    const intersectingList: any = rayCaster.intersectObjects(objects);
    for (let object of objects) {
        object.material.color.set(0x0000ff);
    }
    for (let intersect of intersectingList) {
        intersect.object.material.color.set(0xff0000);
    }
}

// Ray caster using mouse
function rayCasterForMouse() {
    // Using this we don't to set ray from any direction.
    rayCaster.setFromCamera(mouse,camera);
    getRay();
}

const sphereYAxisPosition: number = 5;

function animation() {
    // getRay();
    rayCasterForMouse();
    let elapsedTime = clock.getElapsedTime();
    // Multiplying with 5 to move sphere from -5 to 5
    sphereMesh1.position.y = Math.sin(elapsedTime / 2) * sphereYAxisPosition;
    sphereMesh2.position.y = Math.sin(elapsedTime / 2.4) * sphereYAxisPosition;
    sphereMesh3.position.y = Math.sin(elapsedTime / 1.6) * sphereYAxisPosition;

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animation);
}

animation();

setBeforeRouteChange(() => {
    sphereGeometry1.dispose();
    sphereGeometry2.dispose();
    sphereGeometry3.dispose();
    material1.dispose();
    material2.dispose();
    material3.dispose();
    renderer.dispose();
});