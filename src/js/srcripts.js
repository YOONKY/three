// ref : https://youtu.be/xJAfLdUgdc4 


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'



//default setting
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true; // 그림자
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement); 

const scene = new THREE.Scene();
scene.background = new THREE.Color("aqua");


const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    ); // argument ?


camera.position.set(0, 5, 5);



// controller that can control the orbit by mouse event

const orbit = new OrbitControls(camera, renderer.domElement);  
orbit.update()  



// helper

const axesHelper = new THREE.AxesHelper(5); // argument : length of axes
const gridHelper = new THREE.GridHelper(100, 25); // first argument : size, second argument : # of block
scene.add(axesHelper);
scene.add(gridHelper); 



// object consisted of Geometry and Material

const boxGeometry = new THREE.BoxGeometry(); //parameter
const boxMaterial = new THREE.MeshBasicMaterial({color: 'pink'}); // not effected by light
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box)

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({
    color : 'wheat',
    side : THREE.DoubleSide // 바닥면도
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true // 그림자

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50); // parameter
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'aliceblue',
    wireframe: false
}); 
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere)
sphere.position.set(-10, 10, 0)
sphere.castShadow = true;


// lights

const ambientLight = new THREE.AmbientLight('gray'); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffff, 0.8); // 직선형
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true; 
directionalLight.shadow.camera.bottom = -12 // 그림자 잘림 현상 해결

// light helper
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5); //secondArgument : size of Helper
scene.add(dLightHelper)

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera); // 그림자 카메라로 비추는 영역 확인
scene.add(dLightShadowHelper)

// const spotLight = new THREE.SpotLight(0XFFFFFF); // 방사형
// scene.add(spotLight)
// spotLight.position.set(-100, 100, 0);
// spotLight.castShadow = true; // !pixel 깨지는 현상 발생. spotlight의 앵글을 좁혀주면 덜 티가 난다.
// spotLight.angle = 0.2
// const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper)





// controller  
const gui = new dat.GUI();
const options = {
    sphereColor : '#ffea00',
    wireframe : false,
    speed : 0.01
};

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e)
})
gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0.01);


let step = 0;
function animate () {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;


    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step)); //bounce motion
    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);