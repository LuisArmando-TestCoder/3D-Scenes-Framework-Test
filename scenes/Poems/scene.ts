import Victor from "Victor";
import * as THREE from "three";
import { events, consulters, components, types } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import gsap from "gsap";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../materials/getTextureMaterial";
import getQuixelMaterial from "../../materials/getQuixelMaterial";
import PointLightSet from "../../meshes/PointLightSet";
import wavyMaterial from "../../materials/wavy";
import rainbowMaterial from "../../materials/rainbow";
import straysRing from "./straysRing";
import squaresCluster from "./squaresCluster";
import jumpingTowers from "./jumpingTowers";

function getSlopedCircular(index: number, amount: number, distance = 500) {
  const randomStep = (index / amount) * (Math.PI * 2);
  const randomCircle = {
    x: Math.sin(randomStep),
    z: Math.cos(randomStep),
  };

  return {
    x: randomCircle.x * distance,
    z: randomCircle.z * distance,
  };
}

export default {
  lights: {
    object: () => new components.SimpleLightSet().object,
    // PointLightSet([
    //   {
    //     color: "#fff",
    //     intensity: 1,
    //     distance: 1000,
    //   },
    // ]),
  } as unknown as Scene,
  // diagonalBars: {
  //   properties: {
  //     position: {
  //       z: 5,
  //     },
  //   },
  //   object: () => straysRing,
  // } as unknown as Scene,
  tunnelSquares: {
    object: () => {
      const amount = 12;

      return consulters.getProceduralGroup([
        {
          dimensions: [amount],
          getIntersectionMesh([index]) {
            const { x, z } = getSlopedCircular(index, amount);
            const cluster = squaresCluster({ x, z });

            cluster.position.y = (Math.random() - 0.5) * 250;

            return cluster;
          },
        },
      ]);
    },
    onAnimation({ object3D }: SceneExport) {
      object3D.children.forEach((child) => {
        child.children.forEach((child) => {
          child.rotation.x += 0.1;
        });
      });
    },
  } as unknown as Scene,
  towers: {
    object: () => {
      const amount = 30;

      return consulters.getProceduralGroup([
        {
          dimensions: [amount],
          getIntersectionMesh([index]) {
            const { x, z } = getSlopedCircular(index, amount, 100);
            const towers = jumpingTowers(7);

            towers.position.set(x, 0, z);
            towers.lookAt(new THREE.Vector3());

            return towers;
          },
        },
      ]);
    },
    onSetup({ object3D }: SceneExport) {
      const audio = document?.querySelector("audio") as HTMLAudioElement;

      audio.crossOrigin = "anonymous";

      events.onKey("p").end(() => {
        audio[audio.paused ? "play" : "pause"]();
        console.log(audio);
      });

      const audioProperties = consulters.getAudioProperties(audio);
      const scales = object3D.children
        .map((child) => child.children.map((child) => child.scale.y))
        .flat();

      return {
        audioProperties,
        scales,
      };
    },
    onAnimation({ exported, object3D }: SceneExport) {
      const { frequencies } =
        exported.audioProperties as types.utils.AudioProperties;

      object3D.children.forEach((child, x) => {
        child.children.forEach((child, y) => {
          const index = x + y;

          child.scale.y =
            (exported.scales[index] * (frequencies?.[612 - index] || 0)) / 128;
        });
      });
    },
  } as unknown as Scene,
} as Scenes;
