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
  wavyBall: {
    properties: {
      position: new THREE.Vector3(0, 2.5, 5),
    },
    object: () =>
      consulters.getProceduralGroup([
        {
          geometry: new THREE.SphereBufferGeometry(1, 100, 100),
          material: wavyMaterial,
          dimensions: [2],
          getIntersectionMesh([index], mesh) {
            mesh.rotateX(Math.PI * index);
            mesh.rotateY(Math.PI * index);

            return mesh;
          },
        },
      ]),
    onSetup({ object3D }: SceneExport) {
      let toggleClose = false;

      events.onClickIntersectsObject(object3D.children, () => {
        toggleClose = !toggleClose;

        object3D.children.forEach((child, index) => {
          gsap.timeline().to(child.position, { y: -(index - .5) * +toggleClose, duration: 1 })
        })
      })
    },
  } as unknown as Scene,
} as Scenes;
