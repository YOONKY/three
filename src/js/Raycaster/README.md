ref : https://youtu.be/a0qSHBnqORU



<img src="https://user-images.githubusercontent.com/93643832/234183121-2bf5c55d-267a-4df3-8b3b-3534ff098442.gif">


# Raycaster
3D공간에 있는 물체를 마우스로 컨트롤 하기 위한 클래스입니다.

### code example
```
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
    // pointer : 마우스의 이동 좌표(2차원계)를 THREE.Vector class에 저장.

function onPointerMove( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // 커서의 위치를 pointer에 할당

}

function render() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

    //scene.children에는 Light도 포함되나, raycaster.intersectObjects에서 Light는 고려되지 않음.
    //raycaster.intersectObject는 특정 오브젝트와의 교점을 찾는 만면 IntersectObjects는 object의 array를 Param으로 받아 교점들을 반환함. 둘다 [{}]return

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );

	}

	renderer.render( scene, camera );

}

window.addEventListener( 'pointermove', onPointerMove );

window.requestAnimationFrame(render);
```

## createMesh() vs 전역 생성
전역으로 생성된 cone과 createMesh함수로 생성된 큐브, 스피어 등은 차이없이 결과를 보여줍니다.

## object assign

```
let mesh = {
  first : 1,
  second : 2,
  third : 3
}

let drag = mesh
drag.second = 'not 2!'

```

이때 변경시킨 결과는 mesh에도 반영됩니다.

```
// mesh : 
{ first: 1, second: 'not 2!', third: 3 }

// drag : 
{ first: 1, second: 'not 2!', third: 3 }
```

해당 특성은 array assign에서도 발생합니다.
