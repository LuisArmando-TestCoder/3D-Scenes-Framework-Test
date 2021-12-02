import presetScene, { actions, consulters } from "scene-preset";
import * as THREE from "three";
import rainbowMaterial from "../../materials/rainbow";
import linksScene from "./links.scene";

const sceneEvents = consulters.getSceneLifeCycle(linksScene);

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState) {
        (await sceneEvents).onSetup(canvasState);

        actions.setUniforms(rainbowMaterial);
      },
      async animate(canvasState) {
        (await sceneEvents).onAnimation(canvasState);

        const { cameraVectorsState } = canvasState.presetConfiguration.camera;
        cameraVectorsState.position.min.y = -Infinity;

        actions.blacklistObjects({
          scene: canvasState.scene as THREE.Scene,
          blacklist: [
            "SimpleFloor",
            "SimpleCube",
            "SimpleSphere",
            "SimpleLightSet",
          ],
        });
      },
    },
    `#${id}`
  );
