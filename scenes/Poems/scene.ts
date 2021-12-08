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
import PointLightSet from "../../meshes/PointLightSet";

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
      position: new THREE.Vector3(0, 5, 0),
    },
    object: () => {
      const space = 10;
      const dimensions = [2, 2, 10];
      const getPosition = ({ x, z }: { x: number; z: number }) => ({
        x: Math.sign(x - 0.5) * space,
        z: (z - dimensions[2] / 2) * space,
      });
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
                const position = getPosition({ x, z });

                mesh.position.x = position.x;
                mesh.position.z = position.z;
                mesh.rotateX(Math.PI * y);
                mesh.rotateY(Math.PI * y);

                group.add(mesh);
              });

              group.name = hatchName;

              return group as unknown as THREE.Mesh;
            },
          },
          {
            geometry: new THREE.SphereBufferGeometry(0.5, 100, 100),
            material: rainbowMaterial,
            dimensions,
            getIntersectionMesh([x, y, z], mesh) {
              const position = getPosition({ x, z });

              mesh.position.x = position.x;
              mesh.position.z = position.z;

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
} as Scenes;
