ref : https://youtu.be/C3s0UHpwlf8

# AnimationMixer
특정 오브젝트가 가진 애니메이션을 위한 플레이어. 각각의 오브젝트마다 각각의 애니메이션 믹서가 있어야 합니다.

```
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
        }}
    )
})
```
위와같이 Loader를 이용해 Object를 로드한 후, 루트 오브젝트를 파람으로 넘겨주면 손쉽게 생성 가능합니다.


## change Animation by condition
이렇게 생성된 mixer는 아래의 함수에서 상황에 따라 다른 애니메이션을 보여주는 역할로 사용되었습니다.

```
const controlModelByMouse = ( delta ) => {
    let play = '';
    // get a new targetPoint
    if( character.position.distanceTo(targetPoint) > 0.1){
        // pose
        play = 'Walk';

                            (생략)

    // character arraived at the target point
    } else {
        play = 'Idle';
                            (생략)
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

```
해당 코드는 캐릭터가 타겟포인트에 도착할때까지 걷는 모션을 취하고, 타겟포인트에 도착하면 걷는 모션을 중지하고 멈춰서도록 하는 코드입니다.
currentAction은 현재 적용중인 애니메이션이며, play는 상황에 따라 취해야 하는 애니메이션입니다. currentAction과 play가 다른 경우 fade효과로 자연스럽게 애니메이션을 변경합니다.

