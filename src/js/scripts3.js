import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader, GLTFloader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import wood from '../asset/wood.png'
import CesiumMan from '../asset/CesiumMan.glb'

//CAMERA
const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1500
);
camera.position.set(0,5,5)
camera.lookAt(0, 0, 0)


//RENDERER
const renderer = new THREE.WebGLRenderer({antialias : true})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)


//SCENE
const scene = new THREE.Scene();
scene.add(new THREE.GridHelper(4, 12, 'white','gray'))
scene.add(new THREE.AxesHelper(20))


//ORBIT CONTROLLER
const control = new OrbitControls(camera, renderer.domElement)


//LOADER
const texture = new THREE.TextureLoader().load(wood) 
const assetLoader = new GLTFLoader()

let mixer;
assetLoader.load(CesiumMan, (gltf)=>{
    const model = gltf.scene;
    mixer = new THREE.AnimationMixer(gltf.scene)
    let action = mixer.clipAction(gltf.animations[0])
    action.play();
    scene.add(model)
})

// MESH
const cube = new THREE.Mesh( new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({map : texture}))
cube.position.x -= 2
scene.add(cube)

const cone = new THREE.Mesh( new THREE.ConeGeometry(0.5, 1, 32), new THREE.MeshStandardMaterial({color : 'aliceBlue'}))
cone.position.z += 2
scene.add(cone)


//LIGHT
const light = new THREE.DirectionalLight(0xffffff, 3)
light.position.y += 5
const target = new THREE.Object3D();
target.position.x += 3
light.target = target;


scene.add(light)
scene.add(target)



const clock = new THREE.Clock()

//endless animation roop
export const animate = () => {
    requestAnimationFrame(animate)

    const delta = clock.getDelta();
    mixer.update(delta)
    
    renderer.render(scene, camera)
}


//rerender when window resized
export const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize)



document.body.appendChild(renderer.domElement);

animate()