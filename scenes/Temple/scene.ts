import * as THREE from "three";
import { events, consulters, types } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import rainbowMaterial from "../../materials/rainbow";
import gsap from "gsap";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial, { Maps } from "../../materials/getTextureMaterial";
import PointLightSet from "../../meshes/PointLightSet";

const mapsTranspilation = {
  Albedo: "baseColor",
  Displacement: "bump",
  Metalness: "metal",
  Normal: "normal",
  Roughness: "roughness",
  AO: "ao",
} as const;

type PossibleMap =
  | "Displacement"
  | "Metalness"
  | "AO"
  | "Albedo"
  | "Roughness"
  | "Normal";

function getQuixelPathMaps({
  name,
  code,
  mapNames,
}: {
  name: string;
  code: string;
  mapNames: PossibleMap[];
}): Maps {
  const maps: Maps = {
    baseColor: `./textures/${name}_${code}_2K_surface_ms/${code}_2K_`,
  };
  const basePath = maps.baseColor;

  mapNames
    .concat("Albedo", "Roughness", "Normal")
    .forEach((mapName: PossibleMap) => {
      maps[mapsTranspilation[mapName]] = `${basePath}${mapName}.jpg`;
    });

  return maps;
}

export default {
  ambientLights: {
    object: () =>
      PointLightSet([
        {
          position: new THREE.Vector3(0, 10, 0),
          distance: 25,
          color: "#fff",
          decay: 2.5,
        },
      ]),
    onAnimation({ object3D }: SceneExport, { camera }: CanvasState) {
      object3D.position.set(
        camera?.position.x as number,
        camera?.position.y as number,
        camera?.position.z as number
      );
    },
  } as unknown as SceneExport,
  cube: {
    object: () =>
      new THREE.Mesh(
        new THREE.SphereBufferGeometry(1, 100, 100),
        new THREE.MeshPhysicalMaterial({ color: "#fff" })
      ),
  },
  floor: {
    properties: {
      rotation: {
        x: Math.PI / 2,
      },
    },
    object: () => [
      new THREE.Mesh(
        new THREE.BoxBufferGeometry(25 / 4, 100, 1),
        getTextureMaterial({
          multiplyScalar: 10,
          repeatSet: new THREE.Vector2(1, 16),
          maps: getQuixelPathMaps({
            name: "Marble_Polished",
            code: "vdfjajdv",
            mapNames: ["Displacement", "Metalness"],
          }),
        })
      ),
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(25, 100),
        getTextureMaterial({
          multiplyScalar: 20,
          repeatSet: new THREE.Vector2(1, 4),
          maps: getQuixelPathMaps({
            name: "Stone_Floor",
            code: "vglmadtg",
            mapNames: ["Displacement", "AO"],
          }),
        })
      ),
    ],
  } as unknown as SceneExport,
  wavingLightbulbs: {
    properties: {
      position: {
        y: 20,
      },
    },
    object: () => {
      const waving = 10;
      const distance = 100;
      const amount = 100;

      return {
        object3D: consulters.getProceduralGroup([
          {
            geometry: new THREE.SphereBufferGeometry(1, 1, 1),
            material: new THREE.MeshBasicMaterial({ color: "#ff0" }),
            getIntersectionMesh([index], mesh) {
              const step = (index / amount) * (Math.PI * 2);

              mesh.position.x = Math.sin(step) * distance;
              mesh.position.z = Math.cos(step) * distance;
              mesh.position.y = Math.cos(step * waving) * (waving / 2);

              return mesh;
            },
            dimensions: [amount],
          },
        ]),
        waving,
        distance,
        amount,
      };
    },
    onAnimation(
      { object3D, waving, amount }: SceneExport,
      canvasState: CanvasState
    ) {
      object3D.children.forEach((mesh: THREE.Object3D, index: number) => {
        const step =
          (((new Date().getTime() / 1000 + index) % amount) / amount) *
          (Math.PI * 2);

        mesh.position.y = Math.cos(step * 10) * (waving / 2);
      });
    },
  } as unknown as SceneExport,
} as Scenes;
