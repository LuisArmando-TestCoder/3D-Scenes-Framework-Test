import * as THREE from "three";
import presetScene, { consulters, types, actions, events } from "scene-preset";
import scene from "./scene";

let sceneEvents: {
  sceneGroup: THREE.Group;
  onSetup(canvasState: types.state.CanvasState): void;
  onAnimation(canvasState: types.state.CanvasState): void;
};

actions.addSceneSetupIntrude(
  ({ presetConfiguration }: types.state.CanvasState) => {
    presetConfiguration.ambient.color = 0x000000;
  }
);

function toggleAudio(audio: HTMLAudioElement) {
  return () => {
    console.log(audio.paused)
    audio[audio.paused ? "play" : "pause"]()
  };
}

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState: types.state.CanvasState) {
        sceneEvents = await consulters.getSceneLifeCycle(scene);

        const audio = document?.querySelector("audio") as HTMLAudioElement;
        
        events.onKey("p").end(toggleAudio(audio));
  
        const audioProperties = consulters.getAudioProperties(audio);
  
        sceneEvents?.onSetup(
          {
            ...canvasState, audioProperties
          } as unknown as types.state.CanvasState
        );
      },
      animate(canvasState: types.state.CanvasState) {
        sceneEvents?.onAnimation(canvasState);
      },
    },
    `#${id}`
  );