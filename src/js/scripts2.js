import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



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
    ); 

camera.position.set(20, 20, 20);
// const cameraHelper = new THREE.CameraHelper(camera)
// scene.add(cameraHelper)


// controller that can control the orbit by mouse event
const orbit = new OrbitControls(camera, renderer.domElement);  
orbit.maxPolarAngle = 0.3 * Math.PI
orbit.enabled = false;
// orbit.update()  




// helper
const axesHelper = new THREE.AxesHelper(100); // argument : length of axes
const gridHelper = new THREE.GridHelper(100, 25); // first argument : size, second argument : # of block
scene.add(axesHelper);
scene.add(gridHelper); 




const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({color : 'white', side : THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane)
plane.rotation.x = ( 0.5 * Math.PI)


const cubeGeometry = new THREE.ConeGeometry( 1, 1, 10 );
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);  // 씬에 추가
const speed = 0.1

cube.rotation.z = (0.25 * Math.PI)




const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let currentAnimationId = null;


document.addEventListener('click', onClick);


function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(plane);
  
  if( intersects.length > 0 ){
    const targetPoint = intersects[0].point;

    if(currentAnimationId) {
      cancelAnimationFrame(currentAnimationId)
    }

    moveCubeTo(targetPoint, speed)
  }
}



function moveCubeTo(targetPoint, speed) {
  const direction = targetPoint.clone().sub(cube.position).normalize();
  const velocity = direction.multiplyScalar(speed);
  
  function moveCube() {
    cube.position.add(velocity);
    camera.position.add(velocity);
    
    if (cube.position.distanceTo(targetPoint) < 0.1) {
      cube.position.copy(targetPoint);
    } else {
      currentAnimationId = requestAnimationFrame(moveCube);
    }

  }

  moveCube();
  currentAnimationId = null;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();