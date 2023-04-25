import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'





//CAMERA
const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1500
);
camera.position.set(-35, 70, 100);
camera.lookAt(2, 0, -20);


//RENDERER
const renderer = new THREE.WebGLRenderer({antialias : true})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true


//SCENE 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5)

//ORBIT CONTROLLER
const control = new OrbitControls(camera, renderer.domElement)


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


// scene.add(new THREE.CameraHelper(dLight.shadow.camera))
// scene.add(new THREE.DirectionalLightHelper(dLight))
// scene.add(new THREE.GridHelper(100, 100))


const createFloor = () => {
    let pos = {x: 0, y: -1, z: 0};
    let scale = {x: 100, y: 2, z: 100};

    let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xf9c834}))
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane)

    blockPlane.userData.ground = true;

}

const createBox = () => {
    let scale = {x: 6, y: 6, z: 6};
    let pos = {x: 15, y: scale.y/2, z: 15};
    
    let box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xDC143C}))
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box)

    box.userData.draggable = true;
    box.userData .name = 'BOX'
}

const createSphere = () =>{

    let radius = 4;
    let pos = {x: 15, y: radius, z: -15};

    let sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), 
    new THREE.MeshPhongMaterial({color: 0x43a1f4}))
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere)

    sphere.userData.draggable = true;
    sphere.userData .name = 'SPHERE'

}

const createCylinder = () =>{

    let radius = 4;
    let height = 6;
    let pos = {x: -15, y: height / 2, z: 15};

    let cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 32, 32), 
    new THREE.MeshPhongMaterial({color: 0x3d2b8f}))
    cylinder.position.set(pos.x, pos.y, pos.z);

    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder)

    cylinder.userData.draggable = true;
    cylinder.userData.name = 'CYLINDER'
    

}


const coneGeometry = new THREE.ConeGeometry( 1, 1, 10 );
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.userData.draggable = true;
cone.userData.name = 'cone';
scene.add(cone);




createFloor()
createBox()
createCylinder()
createSphere()




//RAYCASTER

const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();

let draggable

window.addEventListener('click', event => {
    console.log("clcl")
    if(draggable){
        console.log('drop:', draggable.userData.name)
        draggable = null 
        return;
    }

    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(clickMouse, camera);

    console.log("kinder!", scene.children)
    const found = raycaster.intersectObjects( scene.children );
    console.log(found)
    
    if(found.length > 0 && found[0].object.userData.draggable){
        draggable = found[0].object
        console.log("found draggable", draggable.userData.name)
    }
})

window.addEventListener('mousemove', event => {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    moveMouse.y = - (event.clientY / window.innerHeight) * 2 + 1
})



    const dragObject = () => {
        if( draggable != null){
            raycaster.setFromCamera(moveMouse, camera)
            const found = raycaster.intersectObjects( scene.children )
            if(found.length > 0) {
                // for (let o of found){ 
                //     if(!o.object.userData.ground)
                //         continue;

                //         draggable.position.x = o.point.x
                //         draggable.position.z = o.point.z
                //     console.log(draggable)
                // } 
                
                const groundPoint = found.find(o => o.object.userData.ground)
                    draggable.position.x = groundPoint.point.x
                    draggable.position.z = groundPoint.point.z
                
            }
        }
    }










//endless animation roop
export const animate = () => {
    dragObject()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
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