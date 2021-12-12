import Victor from "Victor";
import * as THREE from "three";
import { events, consulters, components } from "scene-preset";
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
import liquidMetalMaterial from "../../materials/liquidMetal";
import trippySpiralMetalMaterial from "../../materials/trippySpiral";

const material = rainbowMaterial;
const displacement = 20;

export default {
  lights: {
    object: () => new components.SimpleLightSet().object,
  },
  author: {
    properties: {
      rotation: {
        y: Math.PI,
      },
      position: {
        x: 10 * displacement,
        z: 10,
      },
    },
    object: () =>
      Text({
        text: `TestCoder | Test Halo Waves`,
        // Morphix | Mercurial Gold
        // Matfas | Trippy interactive spiral
        // TestCoder | Test Halo Waves
        path: "./fonts/Montserrat_Regular.json",
        color: "#f00",
        thickness: 0.1,
        size: displacement,
        material,
      }),
  },
  liquidMetalSky: {
    object: () =>
      new THREE.Mesh(new THREE.SphereBufferGeometry(1000, 100, 100), material),
  },
} as Scenes;
