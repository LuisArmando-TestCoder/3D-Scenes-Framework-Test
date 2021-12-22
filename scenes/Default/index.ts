import presetScene, { actions, types, consulters, events } from "scene-preset";
import * as THREE from "three";
import rainbowMaterial from "../../materials/rainbow";
import wavyMaterial from "../../materials/wavy";
import liquidMetalMaterial from "../../materials/liquidMetal";
import trippySpiralMetalMaterial from "../../materials/trippySpiral";
import textureLogicMetalMaterial from "../../materials/textureLogic";
import basicShaderToyMetalMaterial from "../../materials/basicShaderToy";
import starfieldMaterial from "../../materials/starfield";
import worleyNoiseWatersMaterial from "../../materials/worleyNoiseWaters";

actions.addSceneSetupIntrude(
  ({ presetConfiguration, camera }: types.state.CanvasState) => {
    presetConfiguration.ambient.color = 0x000000;
    presetConfiguration.camera.cameraVectorsState.top.acceleration.x *= 5;
    presetConfiguration.camera.cameraVectorsState.top.acceleration.z *= 5;
    presetConfiguration.camera.cameraVectorsState.friction.x *= 5;
    presetConfiguration.camera.cameraVectorsState.friction.z *= 5;
    camera?.setFocalLength(20);
  }
);

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState: types.state.CanvasState) {
        [
          rainbowMaterial,
          wavyMaterial,
          liquidMetalMaterial,
          trippySpiralMetalMaterial,
          textureLogicMetalMaterial,
          basicShaderToyMetalMaterial,
          starfieldMaterial,
          worleyNoiseWatersMaterial,
        ].forEach((material) => {
          actions.setUniforms(material);
        });

        // let wasRecording = false;
        // let recorder = consulters.getCanvasRecorder(
        //   canvasState.canvas as HTMLCanvasElement
        // );

        // actions.downloadCanvasRecordingOnStop(recorder);
        events.onKey("g").end(() => {
        //   console.log("hey")
        //   recorder[wasRecording ? "stop" : "start"]();
        //   wasRecording = !wasRecording;

        //   if (!wasRecording) {
        //     recorder = consulters.getCanvasRecorder(
        //       canvasState.canvas as HTMLCanvasElement
        //     );
        //     actions.downloadCanvasRecordingOnStop(recorder);
        //   }
        });
      },
      animate(canvasState: types.state.CanvasState) {
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
