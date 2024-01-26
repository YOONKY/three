ref : https://youtu.be/xJAfLdUgdc4 


![img](https://github.com/YOONKY/three/assets/93643832/4324d10e-bb11-4d54-a925-8599cd739bd5)

# 3D 화면을 구성하기 위한 최소한의 요건

## 1. Renderer
카메라와 피사체가 그리는 그림을 계산하여 실제 화면에 띄워주는 역할을 합니다. 
코드 상에서는 렌더러의 돔 엘리먼트를 보디에 삽입하여 화면을 그리게 됩니다.

```javascript
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true; // 그림자
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement); 

```

## 2. Camera
피사체를 보는 눈과 같은 역할을 합니다. 오쏘그라픽한 시선으로 피사체를 응시하는지, 혹은 관점이 있는 시야로 피사체를 응시할 지, 중앙점에서 얼마나 떨어진 곳에, 어디에서, 어떤 각도를 응시할 지 등등을 결정합니다.

```javascript

//create Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    ); 

camera.position.set(0, 5, 5);

```

## 3. Scene
피사체의 역할을 합니다. 백그라운드의 컬러나 질감을 설정할 수도 있고, 오브젝트를 생성해 씬에 넣어 줄 수도 있습니다. 라이트를 생성해 빛의 종류나 광량, 위치를 설정해 줄 수도 있습니다. 또한 각종 헬퍼를 넣어 카메라의 각도는 어떻게 비추고, 빛은 어떻게 들어가며, 오브젝트가 위치하고 형성된 좌표를 보다 정확히 쉽 게 볼 수 있게 할 수도 있습니다.

```Javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color("aqua");

//add Materal to Scene
const boxGeometry = new THREE.BoxGeometry(); //parameter
const boxMaterial = new THREE.MeshBasicMaterial({color: 'pink'}); // not effected by light
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box)

const axesHelper = new THREE.AxesHelper(5); // argument : length of axes
const gridHelper = new THREE.GridHelper(100, 25); // first argument : size, second argument : # of block
scene.add(axesHelper);
scene.add(gridHelper); 

```


코드의 마지막, 화면의 움직임을 허락하는 에니메이션 함수를 만들어주고, 렌더러의 메소드인 셋애니메이션루프에 넘겨주면 화면을 동적으로 움직이는 화면을 그릴 수 있습니다.


```javascript
let step = 0;
function animate () {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;


    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step)); //bounce motion
    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);
```