import * as THREE from "three";
import Victor from "victor";
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
      approachTarget({
        target: canvasState.camera?.position as THREE.Vector3,
        object3D,
        animations,
      });
    },
  } as unknown as Scene,
} as Scenes;

function approachTarget({
  target,
  object3D,
  animations,
  minimumDistance = 7,
  speedScale = 0.01,
}: {
  target: THREE.Vector3;
  object3D: THREE.Object3D;
  animations: Map<string, (number: number) => THREE.AnimationAction>;
  minimumDistance?: number;
  speedScale?: number;
}) {
  const run = animations?.get?.("Run")?.(speedScale);

  if (
    new Victor(target.x, target.z).distance(
      new Victor(object3D.position.x, object3D.position.z)
    ) >= minimumDistance
  ) {
    object3D.lookAt(target.x, -1.5, target.z);

    object3D.position.x += speedScale * (target.x - object3D.position.x);
    object3D.position.z += speedScale * (target.z - object3D.position.z);

    run?.play();

    return;
  }

  run?.stop();
}
