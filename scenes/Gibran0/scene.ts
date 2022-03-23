import Victor from "Victor";
import * as THREE from "three";
import { events, consulters, types } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import gsap from "gsap";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../materials/getTextureMaterial";
import getQuixelMaterial from "../../materials/getQuixelMaterial";
import wavyMaterial from "../../materials/wavy";
import rainbowMaterial from "../../materials/rainbow";
import PointLightSet from "../../meshes/PointLightSet";
import getSquareSpiralPositions from "./squareSpiralPositions";
import { Object3D } from "three";

export default {
  cube: {
    properties: {
      position: new THREE.Vector3(0, -5, 25),
      rotation: new THREE.Vector3(Math.PI, 0, 0),
    },
    object() {
      const geometry = new THREE.BoxBufferGeometry(0.1, 0.01, 0.1);
      const material = new THREE.MeshStandardMaterial({ color: "red" });
      const squareSpiralPositions = getSquareSpiralPositions(1024);
      const abyssStretch = 2;
      const space = .01;

      return consulters.getProceduralGroup([
        {
          geometry,
          material,
          getIntersectionMesh([index], mesh) {
            mesh.position.set(
              squareSpiralPositions[index].x * space,
              -Math.atan(index * space) * abyssStretch,
              squareSpiralPositions[index].y * space,
            );

            return mesh as Object3D;
          },
          dimensions: [squareSpiralPositions.length],
        },
      ]);
    },
    onSetup(
      _: any,
      { audioProperties }: { audioProperties: types.utils.AudioProperties }
    ) {
      return audioProperties;
    },
    onAnimation: ({ object3D, exported: { frequencies } }: SceneExport) => {
    //   object3D.rotation.z -= 0.01;
      object3D.children.forEach((mesh, index) => {
        mesh.scale.y = frequencies?.[index];

        mesh.castShadow = !!mesh.scale.y;
        mesh.visible = !!mesh.scale.y;
      });
    },
  } as unknown as Scene,
  lightFollower: {
    object: () =>
      PointLightSet([
        {
          color: "#fff",
          position: new THREE.Vector3(0, 2, 0),
          distance: 30,
          intensity: 1,
        },
      ]),
    onAnimation: ({ object3D }: SceneExport, canvasState: CanvasState) => {
      object3D.position.set(
        canvasState.camera?.position.x as number,
        canvasState.camera?.position.y as number,
        canvasState.camera?.position.z as number
      );
    },
  } as unknown as Scene,
//   colorfullFloor: {
//     object: () => {
//       const tilesSize = 10;
//       const amount = 100;
//       const spacing = 0.01;

//       return consulters.getProceduralGroup([
//         {
//           geometry: new THREE.BoxBufferGeometry(tilesSize, 0.01, tilesSize),
//           material: new THREE.MeshPhongMaterial({
//             color: "#f1bff2",
//             specular: "#fff",
//             shininess: 30,
//           }),
//           dimensions: [amount, amount],
//           getIntersectionMesh([x, y], mesh) {
//             mesh.position.set(
//               (x - amount / 2) * tilesSize * (1 + spacing),
//               -5,
//               (y - amount / 2) * tilesSize * (1 + spacing)
//             );

//             return mesh;
//           },
//         },
//       ]);
//     },
//   } as unknown as Scene,
} as Scenes;
