ref : https://youtu.be/xJAfLdUgdc4

<img width="827" alt="multiTexture" src="https://user-images.githubusercontent.com/93643832/234549229-88eaf37b-3b64-42a2-bd53-625249bc9996.png">

# MultiTexture
도형이나 배경의 각각 면에 서로 다른 텍스쳐를 입힐 수 있습니다.


```
const texture = [
    new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load(wood)}),
    new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load(wood)}),
    new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load(map)}),
    new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load(wood)}),
    new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load(wood)}),
    new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load(wood)}),
]


//FLOOR
const blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), texture)
blockPlane.position.set(0, -1, 0);
blockPlane.scale.set(100, 2, 100);

blockPlane.castShadow = true;
blockPlane.receiveShadow = true;
scene.add(blockPlane)
```

