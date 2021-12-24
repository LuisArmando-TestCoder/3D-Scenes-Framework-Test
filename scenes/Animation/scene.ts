import * as THREE from "three";
import { consulters, types } from "scene-preset";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";

import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import stage from "../../stages/nightSkyReflectors";

export default {
  ...stage,
  character: {
    properties: {
      position: {
        y: -1.5,
      },
    },
    object: () => Model("./models/gltf/fox_minecraft/scene.gltf"),
    onSetup({ object3D }: SceneExport) {
      object3D.children[0].rotation.z = Math.PI / 2;
    },
    onAnimation(
      { object3D, animations }: SceneExport,
      canvasState: types.state.CanvasState
    ) {
      const camera = canvasState.camera as THREE.Object3D;
      object3D.lookAt(camera.position.x, -1.5, camera.position.z);

      object3D.position.x += 0.01 * (camera.position.x - object3D.position.x);
      object3D.position.z += 0.01 * (camera.position.z - object3D.position.z);

      const run = animations.get("Run")(0.05);

      run.play();
    },
  } as unknown as Scene,
} as Scenes;
