import presetScene, { actions, consulters } from "scene-preset";
import * as THREE from "three";
import scene from "./scene";

const sceneEvents = consulters.getSceneLifeCycle(scene);

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState) {
        (await sceneEvents).onSetup(canvasState);
      },
      async animate(canvasState) {
        (await sceneEvents).onAnimation(canvasState);

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
