import * as THREE from 'three';
import type { SIZE } from './size';

const scene = new THREE.Scene();
const canvas: any = document.querySelector('webgl');
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({canvas});

// Size
function getSize(): SIZE {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    }
}

// const sphere
const sphereGeometry1: THREE.SphereGeometry = new THREE.SphereGeometry( 15, 32, 16 );
const sphereGeometry2: THREE.SphereGeometry = new THREE.SphereGeometry( 15, 32, 16 );
const sphereGeometry3: THREE.SphereGeometry = new THREE.SphereGeometry( 15, 32, 16 );
const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

const sphereMesh1: THREE.Mesh = new THREE.Mesh(sphereGeometry1,material);
sphereMesh1.position.x = -10;
scene.add(sphereMesh1);
const sphereMesh2: THREE.Mesh = new THREE.Mesh(sphereGeometry2,material);
scene.add(sphereMesh2);
const sphereMesh3: THREE.Mesh = new THREE.Mesh(sphereGeometry3,material);
sphereMesh3.position.x = 10;
scene.add(sphereMesh3);

const size: SIZE = getSize();
const fieldOfView: number = 45;
const aspectRatio: number = size.width / size.height;
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(fieldOfView,aspectRatio);
camera.position.z = 10;

renderer.setSize(size.width,size.height);
renderer.render(scene,camera);