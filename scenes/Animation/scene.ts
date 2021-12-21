import Victor from "Victor";
import * as THREE from "three";
import { events, consulters } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import gsap from "gsap";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../materials/getTextureMaterial";
import getQuixelMaterial from "../../materials/getQuixelMaterial";
import wavyMaterial from "../../materials/wavy";
import starfieldMaterial from "../../materials/starfield";
import worleyNoiseWatersMaterial from "../../materials/worleyNoiseWaters";
import PointLightSet from "../../meshes/PointLightSet";

export default {
  sky: {
    properties: {
      rotation: {
        z: -Math.PI,
        x: -Math.PI / 2
      },
      position: {
        y: -500
      }
    },
    object: () =>
      new THREE.Mesh(
        new THREE.SphereBufferGeometry(1500, 100, 100),
        starfieldMaterial
      ),
    onSetup({ object3D }: SceneExport) {
      console.log(object3D)
    }
  } as unknown as Scene,
  floor: {
    properties: {
      rotation: {
        y: -Math.PI / 4
      },
      position: new THREE.Vector3(0, -10, 0),
    },
    object: () =>
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2500, 2500),
        worleyNoiseWatersMaterial
      ),
    onSetup({ object3D: floor }: SceneExport) {
      floor.rotateX(Math.PI / 2);
    },
  } as unknown as Scene,
} as Scenes;
