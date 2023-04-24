import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import W from '../../../asset/Warpen.json'


    //SCENE 
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff)

    //CAMERA
    const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1500
    );
    
    camera.position.set(3, 20, 45);
    camera.lookAt(2, 0, -20);

    //RENDERER
    const renderer = new THREE.WebGLRenderer({antialias : true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true 
    
    //ORBIT CONTROLLER
    const control = new OrbitControls(camera, renderer.domElement)
    control.target = new THREE.Vector3(0, 0, -40);
    control.update();
    
    
    //MESH  
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshPhongMaterial({color : 0x0a7d15}));
    plane.rotation.x = - Math.PI / 2 ;
    plane.receiveShadow = true;
    scene.add(plane)
    

    //LIGHT
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const light1 = new THREE.PointLight(0xff6666, 1, 100);
    light1.castShadow = true;
    light1.shadow.mapSize.width = 4096;
    light1.shadow.mapSize.height = 4096;
    scene.add(light1)

    const light2 = new THREE.PointLight(0x33ff33, 1, 100);
    light1.castShadow = true;
    light1.shadow.mapSize.width = 4096;
    light1.shadow.mapSize.height = 4096;
    scene.add(light2)


    //FONT LOADER
    const loader = new FontLoader();

    loader.loadAsync('../../../asset/JournalDingbats.json').then(
        (font)=> {

            const geometry = new TextGeometry( `123456`, {
                font: font,
                size: 6,
                height: 2,
            })
    
            const textMesh = new THREE.Mesh(geometry, [
                new THREE.MeshPhongMaterial({color : 'red'}), // front + backs
                new THREE.MeshPhongMaterial({color : 'pink'}) // side
            ])
    
            textMesh.castShadow = true;
            textMesh.position.x = -8;
            textMesh.position.y += 15;
            textMesh.position.z -= 40;
            textMesh.rotation.y = -0.50;
            scene.add(textMesh)
        }
    )












//endless animation roop
export const animate = () => {
    const now = Date.now() / 1000;
    light1.position.y = 15;
    light1.position.x = Math.cos(now) * 20
    light1.position.z = Math.sin(now) * 20
    
    light2.position.y = 15;
    light2.position.x = Math.sin(now) * 20
    light2.position.z = Math.cos(now) * 20

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