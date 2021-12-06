import presetScene, { actions, types, consulters, events } from "scene-preset";
import * as THREE from "three";
import rainbowMaterial from "../../materials/rainbow";
import wavyMaterial from "../../materials/wavy";

actions.addSceneSetupIntrude((canvasState: types.state.CanvasState) => {
  canvasState.presetConfiguration.ambient.color = 0x000000;
  canvasState?.camera?.setFocalLength(20);
});

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState) {
        [rainbowMaterial, wavyMaterial].forEach((material) => {
          actions.setUniforms(material);
        });

        let wasRecording = false;
        const recorder = consulters.getCanvasRecorder(
          canvasState.canvas as HTMLCanvasElement
        );

        actions.downloadCanvasRecordingOnStop(recorder);
        events.onKey("g").end(() => {
          recorder[wasRecording ? "stop" : "start"]();
          wasRecording = !wasRecording;
        });
      },
      async animate(canvasState) {
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
