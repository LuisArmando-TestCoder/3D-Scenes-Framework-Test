import presetScene, { consulters } from "scene-preset";
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
      },
    },
    `#${id}`
  );
