import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

// Create a scene
const scene = new THREE.Scene();

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);


const textureLoader = new THREE.TextureLoader();
const faceTextures = [];
for (let i = 1; i <= 6; i++) {
    const texture = textureLoader.load(`numbers/${i}.png`);
    faceTextures.push(new THREE.MeshStandardMaterial({ map: texture }));
}

const cube = new THREE.Mesh(geometry, faceTextures);
scene.add(cube);


const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const directional2Light = new THREE.DirectionalLight(0xffffff, 0.1);
directional2Light.position.set(-5, -5, -5);
scene.add(directional2Light);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(lightHelper);

const lightHelper2 = new THREE.DirectionalLightHelper(directional2Light, 1);
scene.add(lightHelper2);


const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);


const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 20, 100);
controls.update();


const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('TO GAMBLE IS TO EVENTUALLY LOSE', {
        font: font,
        size: 1,
        height: 0.2,
    });

    const textMaterial = new THREE.MeshStandardMaterial({
        color: 0xe7e7e7,
        wireframe: true,
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    
    textMesh.position.set(-10.5, 3, 0);
    scene.add(textMesh);
});

const bladeGeometry = new THREE.BoxGeometry(0.1, 2, 0.5);
const bladeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x808080,        
    transparent: true,      
    opacity: 0.4,          
    roughness: 0.1,         
    metalness: 0.1,         
    reflectivity: 0.9,     
    clearcoat: 1,           
    clearcoatRoughness: 0.1 
});
const blades = [];

for (let i = 0; i < 100; i++) {
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);

    // Randomize position and rotation
    blade.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 0.10 * 20,
        (Math.random() - 0.5) * 20
    );
    blade.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );

    //animation
    blade.userData = {
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01,
        speedZ: (Math.random() - 0.5) * 0.01,
    };

    blades.push(blade);
    scene.add(blade);
}

let isSpinning = false;
let spinSpeed = { x: 0, y: 0, z: 0 };

window.addEventListener('click', () => {
    if (!isSpinning) {
        spinSpeed.x = Math.random() * 0.2 - 0.1;
        spinSpeed.y = Math.random() * 0.2 - 0.1;
        spinSpeed.z = Math.random() * 0.2 - 0.1;
        isSpinning = true;
    }
});
//debugger
const gui = new dat.GUI();

// Cube
const cubeFolder = gui.addFolder('Cube Materials');
faceTextures.forEach((material, index) => {
    const faceFolder = cubeFolder.addFolder(`Face ${index + 1}`);
    faceFolder.add(material, 'metalness', 0, 1, 0.01).name('Metalness');
    faceFolder.add(material, 'roughness', 0, 1, 0.01).name('Roughness');
});
cubeFolder.open();

// Lighting 
const lightFolder = gui.addFolder('Lighting');
lightFolder.add(directionalLight, 'intensity', 0, 10, 0.1).name('Dir Light Intensity');
lightFolder.add(directional2Light, 'intensity', 0, 10, 0.1).name('Dir2 Light Intensity');
lightFolder.add(pointLight, 'intensity', 0, 10, 0.1).name('Point Light Intensity');
lightFolder.add(directionalLight.position, 'x', -10, 10, 0.1).name('Dir Light X');
lightFolder.add(directionalLight.position, 'y', -10, 10, 0.1).name('Dir Light Y');
lightFolder.add(directionalLight.position, 'z', -10, 10, 0.1).name('Dir Light Z');
lightFolder.open();

// Blade 
const bladeFolder = gui.addFolder('Blades');
bladeFolder.add(bladeMaterial, 'opacity', 0, 1, 0.01).name('Opacity');
bladeFolder.add(bladeMaterial, 'roughness', 0, 1, 0.01).name('Roughness');
bladeFolder.add(bladeMaterial, 'metalness', 0, 1, 0.01).name('Metalness');
bladeFolder.add(bladeMaterial, 'clearcoat', 0, 1, 0.01).name('Clearcoat');
bladeFolder.add(bladeMaterial, 'clearcoatRoughness', 0, 1, 0.01).name('Clearcoat Roughness');
bladeFolder.open();




const tick = () => {
    if (isSpinning) {
        cube.rotation.x += spinSpeed.x;
        cube.rotation.y += spinSpeed.y;
        cube.rotation.z += spinSpeed.z;

        spinSpeed.x *= 0.99;
        spinSpeed.y *= 0.99;
        spinSpeed.z *= 0.99;

        if (Math.abs(spinSpeed.x) < 0.001 && Math.abs(spinSpeed.y) < 0.001 && Math.abs(spinSpeed.z) < 0.001) {
            isSpinning = false;
        }
    }

    
    blades.forEach((blade) => {
        blade.rotation.x += blade.userData.speedX;
        blade.rotation.y += blade.userData.speedY;
        blade.rotation.z += blade.userData.speedZ;

        blade.position.y += Math.sin(Date.now() * 0.001) * 0.01;
    });

    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(tick);
};

tick();
