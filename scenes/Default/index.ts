import presetScene, { actions } from "scene-preset";
import * as THREE from "three";
import getSceneEvents from "./getSceneEvents";
import linksScene from "./links.scene";

const sceneEvents = getSceneEvents(linksScene);

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState) {
        (await sceneEvents).onSetup(canvasState);
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
