import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Soldier from '../../../asset/Soldier.glb'


//SCENE 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def5)


//CAMERA
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    ); 

camera.position.set(20, 20, 20);


const xHelper = new THREE.AxesHelper(100)
scene.add(xHelper)

//RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias : true // 픽셀 계단현상
}) 
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true


//ORBIT CONTROLLER
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.enabled = false;



//LIGHTS
const aLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(aLight);

const dLight = new THREE.DirectionalLight(0xffffff, 1);
dLight.position.set(-60, 50, -30);
scene.add(dLight);
dLight.castShadow = true;
dLight.shadow.mapSize.width = 2048;
dLight.shadow.mapSize.height = 2048;
dLight.shadow.camera.left = -70;
dLight.shadow.camera.right = 70;
dLight.shadow.camera.top = 70;
dLight.shadow.camera.bottom = -70;


//FLOOR


const blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xf9c834}))
blockPlane.position.set(0, -1, 0);
blockPlane.scale.set(100, 2, 100);
blockPlane.castShadow = true;
blockPlane.receiveShadow = true;
scene.add(blockPlane)









//////////CHARACTER CONTROL///////////

let character;
let mixer;
let targetPoint;
let currentAction = 'Idle';
let rotateQuarternion = new THREE.Quaternion();
let rotateAngle = new THREE.Vector3(0, 1, 0)
const animationsMap = new Map()

new GLTFLoader().load(Soldier, (gltf) => {
    const model = gltf.scene;
    model.traverse((object) => {
        if(object.isMesh) object.castShadow = true;
    })
    character = model;
    mixer = new THREE.AnimationMixer(model)
    targetPoint = model.position;
    scene.add(model)

    const gltfAnimation = gltf.animations;

    gltfAnimation
    .filter(a => a.name !== 'Tpose')
    .forEach(a => animationsMap.set(a.name, mixer.clipAction(a)))
    
    animationsMap.forEach((value, key) => {
        if(key == currentAction){
            value.play()
        }
    })
})



//MOUSE CONTROL

const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();

window.addEventListener('click', event => {
    
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    clickMouse.y = - (event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(clickMouse, camera);
    const point = raycaster.intersectObject( blockPlane )
    

    if(point.length > 0) {
        targetPoint = point[0].point;

    }
})



const controlModelByMouse = ( delta ) => {
    
    let fadeDuration = 0.1;
    let speed = 0.04;    
    let play = '';

    // get a new targetPoint
    if( character.position.distanceTo(targetPoint) > 0.1){
        // pose
        play = 'Walk';
        // rotate
        let angleYDirection = Math.atan2(
            (character.position.x - targetPoint.x),
            (character.position.z - targetPoint.z)
            )
        rotateQuarternion.setFromAxisAngle(rotateAngle, angleYDirection)
        character.quaternion.rotateTowards(rotateQuarternion, 0.2)
        
        // move
        const direction = targetPoint.clone().sub(character.position).normalize()
        const velocity = direction.multiplyScalar(speed);
        
        character.position.add(velocity);
        camera.position.add(velocity);
        





    // character arraived at the target point
    } else {
        play = 'Idle';
        character.position.copy(targetPoint)
    }

    // change animation
    if (currentAction != play) {
        const toPlay = animationsMap.get(play)
        const current = animationsMap.get(currentAction)
        
        current.fadeOut(fadeDuration)
        toPlay.reset().fadeIn(fadeDuration).play();
        
        currentAction = play
    }
    
    mixer.update(delta)
}









const clock = new THREE.Clock()
//endless animation roop

export const animate = () => {
    let mixerUpdateDelta = clock.getDelta();
    if(character){
        controlModelByMouse(mixerUpdateDelta)
    }
    
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}



//rerender when window resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

document.body.appendChild(renderer.domElement);



animate()