import Victor from "Victor";
import * as THREE from "three";
import { events, consulters, components, types } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { AudioProperties } from "scene-preset/lib/types/utils";
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
import liquidMetal from "../../materials/liquidMetal";
import basicShaderToyMaterial from "../../materials/basicShaderToy";
import trippySpiralMetalMaterial from "../../materials/trippySpiral";

import straysRing from "./straysRing";
import squaresCluster from "./squaresCluster";
import jumpingTowers from "./jumpingTowers";

const time = () => new Date().getTime() / 1000;

export default {
  sky: {
    object: () =>
      new THREE.Mesh(
        new THREE.SphereBufferGeometry(1500, 100, 100),
        trippySpiralMetalMaterial
      ),
  },
  robot: {
    properties: {
      position: {
        y: 10,
      },
      rotation: {
        y: Math.PI / 2,
      },
    },
    object: () => Model("./models/gltf/robot/scene.gltf"),
    onSetup({ object3D }: SceneExport) {
      const trigger = { fall: false };

      events.onKey("p").end(() => {
        trigger.fall = true;
      });

      return trigger;
    },
    onAnimation({ object3D, exported }: SceneExport) {
      if (exported.fall) {
        object3D.position.y -= 0.001;
      }
    },
  } as unknown as Scene,
  lights: {
    properties: {
      position: {
        y: 10,
        x: -20,
      },
    },
    object: () =>
      PointLightSet([
        {
          color: "#fff",
          distance: 0,
        },
      ]),
  } as unknown as Scene,
  diagonalBars: {
    object: () => straysRing(1),
    onAnimation({ object3D }: SceneExport) {
      object3D.children.forEach((child, z, { length: zlength }) => {
        child.children.forEach((child, y, { length: ylength }) => {
          child.children.forEach((child, x, { length: xlength }) => {
            const index = x + y + z;
            const length = xlength + ylength + zlength;
            child.position.y +=
              Math.sin((index / length) * Math.PI * 2 + time()) / 100;
          });
        });
      });
    },
  } as unknown as Scene,
  tunnelSquares: {
    object: () => {
      const amount = 20;
      const size = 20;
      const height = 50;

      return consulters.getProceduralGroup([
        {
          geometry: new THREE.BoxBufferGeometry(
            size * 0.9,
            size * 0.9,
            size * 0.9
          ),
          material: new THREE.MeshStandardMaterial({ color: "#aaa" }),
          getIntersectionMesh(indices, mesh) {
            const step = (indices[1] / amount) * Math.PI * 2;
            const y = (indices[0] - height / 2) * size;
            mesh.position.set(
              Math.sin(step) * (amount / 2 / Math.PI) * size,
              y,
              Math.cos(step) * (amount / 2 / Math.PI) * size
            );
            mesh.lookAt(new THREE.Vector3(0, y, 0));

            return mesh;
          },
          dimensions: [height, amount],
        },
      ]);
    },
    onSetup({ object3D }: SceneExport) {
      const audio = document?.querySelector("audio") as HTMLAudioElement;

      events.onKey("p").end(() => {
        audio[audio.paused ? "play" : "pause"]();
      });

      const audioProperties = consulters.getAudioProperties(audio);
      const scales = object3D.children.map((child) => child.scale.z).flat();
      return {
        audioProperties,
        scales,
      };
    },
    onAnimation({ exported, object3D }: SceneExport) {
      const { frequencies } = exported.audioProperties as AudioProperties;
      object3D.children.forEach((child, index) => {
        child.scale.z =
          1 +
          (exported.scales[index % 1024] *
            (frequencies?.[612 - (index % 1024)] || 0)) /
            128;
      });
    },
  } as unknown as Scene,
  voidLines: {
    object: () => {
      const amount = 1;

      return consulters.getProceduralGroup([
        {
          dimensions: [amount],
          getIntersectionMesh([index]) {
            const cluster = squaresCluster({ x: 0, z: 0, size: 5 });

            return cluster;
          },
        },
      ]);
    },
    onAnimation({ object3D }: SceneExport) {
      object3D.children.forEach((child) => {
        child.children.forEach((child) => {
          child.rotation.x += 0.02;
        });
      });
    },
  } as unknown as Scene,
} as Scenes;
