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

let lastOpenedState = false;

export default {
  lightFollower: {
    object: () =>
      PointLightSet([
        {
          color: "#fff",
          position: new THREE.Vector3(0, 2, 0),
          distance: 35,
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
  hatches: {
    properties: {
      position: new THREE.Vector3(0, 2, 35),
    },
    object: () => {
      const spacing = {
        x: 25,
        z: 4,
      };
      const dimensions = [3, 2, 1];
      const setPosition = (
        { x, z }: { x: number; z: number },
        position: THREE.Vector3
      ) => {
        position.x = (x / dimensions[0] - Math.sign(x) / 2) * spacing.x;
        position.z = (z - dimensions[2] / 2) * spacing.z;
      };
      const hatchName = "wavyEgg";

      return {
        object3D: consulters.getProceduralGroup([
          {
            geometry: new THREE.SphereBufferGeometry(1, 100, 100),
            material: wavyMaterial,
            dimensions: [dimensions[0], dimensions[2]],
            getIntersectionMesh([x, z], meshTemplate) {
              const group = new THREE.Group();

              [0, 1].forEach((y) => {
                const mesh = meshTemplate.clone();
                setPosition({ x, z }, mesh.position);

                mesh.rotateX(Math.PI * y);
                mesh.rotateY(Math.PI * y);

                group.add(mesh);
              });

              group.name = hatchName;

              console.log('x', x)

              return group as unknown as THREE.Mesh;
            },
          },
          {
            geometry: new THREE.SphereBufferGeometry(0.5, 100, 100),
            material: rainbowMaterial,
            dimensions,
            getIntersectionMesh([x, y, z], mesh) {
              setPosition({ x, z }, mesh.position);

              return mesh;
            },
          },
        ]),
        hatchName,
      };
    },
    onSetup({ object3D, hatchName }: SceneExport) {
      object3D.children
        .filter(({ name }) => name === hatchName)
        .forEach((child) => {
          let toggleClose = false;

          events.onClickIntersectsObject([child], () => {
            toggleClose = !toggleClose;

            child.children.forEach((mesh, index) => {
              const y = index - 0.5;

              gsap.timeline().to(mesh.position, {
                y: -y * +toggleClose,
                duration: 1,
              });
            });
          });
        });
    },
  } as unknown as SceneExport,
  door: {
    properties: {
      position: new THREE.Vector3(0, 0, 25),
    },
    object: () => {
      const width = 5;

      return {
        object3D: consulters.getProceduralGroup([
          {
            dimensions: [2],
            material: getQuixelMaterial({
              name: "Wood_Plank",
              code: "uk3kffzn",
              mapNames: ["AO", "Displacement"],
            }),
            geometry: new THREE.BoxBufferGeometry(width, width * 2, 1),
            getIntersectionMesh([x], mesh) {
              mesh.position.x = (x - 0.5) * width;

              return mesh;
            },
          },
        ]),
        width,
      };
    },
    onAnimation({ object3D, width }: SceneExport, canvasState: CanvasState) {
      const cameraPosition = new Victor(
        canvasState.camera?.position.x,
        canvasState.camera?.position.z
      );
      const objectPosition = new Victor(
        object3D.position.x,
        object3D.position.z
      );
      const distanceToOpen = 20;
      const distance = cameraPosition.distance(objectPosition);

      // console.log('distance', distance);

      const isOpened = distance <= distanceToOpen;

      if (lastOpenedState !== isOpened) {
        lastOpenedState = isOpened;

        object3D.children.forEach((child, index) => {
          const x = (index - 0.5) * width * (isOpened ? 3 : 1);

          // console.log('x', x)

          gsap.timeline().to(child.position, {
            x,
            duration: 1.5,
          });
        });
      }
    },
  } as unknown as SceneExport,
} as Scenes;
