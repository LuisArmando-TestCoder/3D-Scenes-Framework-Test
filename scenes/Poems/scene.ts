import Victor from "Victor";
import * as THREE from "three";
import { events, consulters } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import wavyMaterial from "../../materials/wavy";
import rainbowMaterial from "../../materials/rainbow";
import gsap from "gsap";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../materials/getTextureMaterial";
import getQuixelMaterial from "../../materials/getQuixelMaterial";
import PointLightSet from "../../meshes/PointLightSet";
import getPathPositions from "./getPathPositions";

const pathPositions = getPathPositions(798838645950457, 4);
const pathSize = 10;
let lastOpenedState = false;

function getFloorTable(y: number) {
  return function ([index]: number[], mesh: THREE.Mesh) {
    mesh.position.set(
      pathPositions[index].x * pathSize,
      y,
      pathPositions[index].z * pathSize
    );

    mesh.rotateZ(Math.PI / 2);

    return mesh;
  };
}

export default {
  path: {
    object: () =>
      consulters.getProceduralGroup([
        {
          dimensions: [pathPositions.length],
          material: getQuixelMaterial({
            multiplyScalar: pathSize,
            name: "Wood_Parquet",
            code: "uenndanl",
            mapNames: ["AO", "Displacement"],
          }),
          geometry: new THREE.BoxBufferGeometry(0.1, pathSize, pathSize),
          getIntersectionMesh: getFloorTable(0),
        },
        {
          dimensions: [pathPositions.length],
          material: new THREE.MeshBasicMaterial({ color: "#fff" }),
          geometry: new THREE.BoxBufferGeometry(0.1, pathSize, pathSize),
          getIntersectionMesh: getFloorTable(10),
        },
        {
          dimensions: [pathPositions.length, 2], // corners, side-lanes and frontals have always two spots n which a work can be placed
          material: new THREE.MeshStandardMaterial({ color: "#fff" }),
          geometry: new THREE.BoxBufferGeometry(
            pathSize / 2,
            pathSize / 2,
            0.1
          ),
          getIntersectionMesh([index, pair], mesh) {
            const { x, z, laneType } = pathPositions[index];
            const wrapper = new THREE.Group();

            wrapper.add(mesh);

            wrapper.position.set(x * pathSize, 5, z * pathSize);

            const laneName = (laneType + pair) as
              | "frontal0"
              | "frontal1"
              | "side-lane0"
              | "side-lane1";
            // | "corner0"
            // | "corner1";
            const laneRotations = {
              frontal0: -Math.PI / 2,
              frontal1: Math.PI / 2,
              "side-lane0": 0,
              "side-lane1": Math.PI,
              // "corner0": /* conditional */,
              // "corner1": /* conditional */,
            };

            if (laneRotations[laneName]) {
              mesh.rotateY(laneRotations[laneName]);
            }

            const displacement = pathSize / 2;
            const lanePositions = {
              frontal0: {
                x: displacement,
                z: 0,
              },
              frontal1: {
                x: -displacement,
                z: 0,
              },
              "side-lane0": {
                x: 0,
                z: displacement,
              },
              "side-lane1": {
                x: 0,
                z: -displacement,
              },
              // "corner": {
              //   x: 0,
              //   z: displacement,
              // },
              // "corner": {
              //   x: 0,
              //   z: -displacement,
              // }
            };

            if (lanePositions[laneName]) {
              mesh.position.x += lanePositions[laneName].x;
              mesh.position.z += lanePositions[laneName].z;
            }

            // mesh.position.z += pathSize;

            return wrapper as unknown as THREE.Mesh;
          },
        },
      ]),
  } as unknown as Scene,
  // hatches: {
  //   properties: {
  //     position: new THREE.Vector3(0, 2, 35),
  //   },
  //   object: () => {
  //     const spacing = {
  //       x: 25,
  //       z: 4,
  //     };
  //     const dimensions = [3, 2, 1];
  //     const setPosition = (
  //       { x, z }: { x: number; z: number },
  //       position: THREE.Vector3
  //     ) => {
  //       position.x = (x / dimensions[0] - Math.sign(x) / 2) * spacing.x;
  //       position.z = (z - dimensions[2] / 2) * spacing.z;
  //     };
  //     const hatchName = "wavyEgg";

  //     return {
  //       object3D: consulters.getProceduralGroup([
  //         {
  //           geometry: new THREE.SphereBufferGeometry(1, 100, 100),
  //           material: wavyMaterial,
  //           dimensions: [dimensions[0], dimensions[2]],
  //           getIntersectionMesh([x, z], meshTemplate) {
  //             const group = new THREE.Group();

  //             [0, 1].forEach((y) => {
  //               const mesh = meshTemplate.clone();
  //               setPosition({ x, z }, mesh.position);

  //               mesh.rotateX(Math.PI * y);
  //               mesh.rotateY(Math.PI * y);

  //               group.add(mesh);
  //             });

  //             group.name = hatchName;

  //             return group as unknown as THREE.Mesh;
  //           },
  //         },
  //         {
  //           geometry: new THREE.SphereBufferGeometry(0.5, 100, 100),
  //           material: rainbowMaterial,
  //           dimensions,
  //           getIntersectionMesh([x, y, z], mesh) {
  //             setPosition({ x, z }, mesh.position);

  //             return mesh;
  //           },
  //         },
  //       ]),
  //       hatchName,
  //     };
  //   },
  //   onSetup({ object3D, hatchName }: SceneExport) {
  //     object3D.children
  //       .filter(({ name }) => name === hatchName)
  //       .forEach((child) => {
  //         let toggleClose = false;

  //         events.onClickIntersectsObject([child], () => {
  //           toggleClose = !toggleClose;

  //           child.children.forEach((mesh, index) => {
  //             const y = index - 0.5;

  //             gsap.timeline().to(mesh.position, {
  //               y: -y * +toggleClose,
  //               duration: 1,
  //             });
  //           });
  //         });
  //       });
  //   },
  // } as unknown as SceneExport,
  lights: {
    object: () =>
      PointLightSet(
        pathPositions
          .filter((_, index) => index % 7 === 0)
          .map(({ x, z }) => ({
            color: "#fff",
            position: new THREE.Vector3(
              x * pathSize,
              pathSize * 1.5,
              z * pathSize
            ),
            distance: pathSize * 2.5,
            intensity: 6,
            decay: 3,
          }))
      ),
  } as unknown as Scene,
  lightFollower: {
    object: () =>
      PointLightSet([
        {
          color: "#fff",
          position: new THREE.Vector3(0, 2, 0),
          distance: 25,
          intensity: 0.1,
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
  // door: {
  //   properties: {
  //     position: new THREE.Vector3(0, 0, 10),
  //   },
  //   object: () => {
  //     const width = 5;

  //     return {
  //       object3D: consulters.getProceduralGroup([
  //         {
  //           dimensions: [2],
  //           material: getQuixelMaterial({
  //             name: "Wood_Plank",
  //             code: "uk3kffzn",
  //             mapNames: ["AO", "Displacement"],
  //           }),
  //           geometry: new THREE.BoxBufferGeometry(width, width * 2, 1),
  //           getIntersectionMesh([x], mesh) {
  //             mesh.position.x = (x - 0.5) * width;

  //             return mesh;
  //           },
  //         },
  //       ]),
  //       width,
  //     };
  //   },
  //   onAnimation({ object3D, width }: SceneExport, canvasState: CanvasState) {
  //     const cameraPosition = new Victor(
  //       canvasState.camera?.position.x,
  //       canvasState.camera?.position.z
  //     );
  //     const objectPosition = new Victor(
  //       object3D.position.x,
  //       object3D.position.z
  //     );
  //     const distanceToOpen = 10;
  //     const distance = cameraPosition.distance(objectPosition);
  //     const isOpened = distance <= distanceToOpen;

  //     if (lastOpenedState !== isOpened) {
  //       lastOpenedState = isOpened;

  //       object3D.children.forEach((child, index) => {
  //         const x = (index - 0.5) * width * (isOpened ? 3 : 1);

  //         // console.log('x', x)

  //         gsap.timeline().to(child.position, {
  //           x,
  //           duration: 5,
  //         });
  //       });
  //     }
  //   },
  // } as unknown as SceneExport,
} as Scenes;
