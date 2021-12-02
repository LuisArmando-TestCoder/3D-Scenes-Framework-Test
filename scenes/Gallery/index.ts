import presetScene, { actions, consulters, types } from "scene-preset";
import * as THREE from "three";
import galleryScene from "./gallery.scene";

actions.addSceneSetupIntrude((canvasState: types.state.CanvasState) => {
  canvasState.presetConfiguration.ambient.color = 0x000000;
  canvasState.presetConfiguration.camera.fov = 15;
  canvasState?.camera?.["setFocalLength"](20);
});

const sceneEvents = consulters.getSceneLifeCycle(galleryScene);

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
