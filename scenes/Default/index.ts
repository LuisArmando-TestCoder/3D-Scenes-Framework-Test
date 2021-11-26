import presetScene, { consulters, actions, events } from "scene-preset";
import { CanvasState } from "scene-preset/lib/state/canvases";
import gsap from "gsap";
import * as THREE from "three";
import Image from "../../meshes/Image";
import getSceneEvents from "./getSceneEvents";
import linksScene from "./links.scene";

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState) {
        const sceneEvents = await getSceneEvents(linksScene);

        sceneEvents.onSetup(canvasState);
      },
      animate({ scene, presetConfiguration }) {
        const { cameraVectorsState } = presetConfiguration.camera;

        cameraVectorsState.position.min.y = -Infinity;

        actions.blacklistObjects({
          scene: scene as THREE.Scene,
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
