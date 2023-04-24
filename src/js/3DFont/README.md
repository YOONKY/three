ref : https://youtu.be/mVG6kEEAGA0

# `taxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    at JSON.parse (<anonymous>) `에러 처리
.ttf를 .json으로 전환한 asset을 loader를 통해 async로 받아옵니다.
해당 과정에서 Warpen.json이 읽히지 않고 index.html이 읽히게 되어 에러가 발생하였습니다.
dist directory 내에 Warpen.json이 정상적으로 형성되지 않아 생긴 문제로 추측하였습니다.

##parcel Asset 관리
### parcel-plugin-static-files-copy
해당 라이브러리는 Three / asset 폴더를 parcel에 의해 형성되는 dist 폴더 밑에 고스란히 카피해주는 기능을 합니다.
package.json 내의 아래 항목을 추가합니다.

```"staticFiles": {
    "staticPath": [
      {
        "staticPath": "asset",
        "staticOutDir": "asset"
      }
    ]
  }```

