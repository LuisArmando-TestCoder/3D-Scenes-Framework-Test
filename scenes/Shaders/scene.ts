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
import rainbowMaterial from "../../materials/rainbow";
import trippySpiralMaterial from "../../materials/trippySpiral";
import liquidMetalMaterial from "../../materials/liquidMetal";
import PointLightSet from "../../meshes/PointLightSet";

export default {
  sky: {
    object: () =>
      new THREE.Mesh(
        new THREE.SphereBufferGeometry(1000, 100, 100),
        liquidMetalMaterial
      ),
  },
  // author: {
  //   properties: {
  //     position: new THREE.Vector3(5, 3, 20),
  //     rotation: new THREE.Vector3(0, Math.PI, 0),
  //   },
  //   object: () =>
  //     Text({
  //       text: `Morphix | Mercurial Gold`,
  //       path: "./fonts/Montserrat_Regular.json",
  //       color: "#f00",
  //       thickness: 5,
  //       size: 20,
  //       material: liquidMetalMaterial,
  //     }),
  // },
} as Scenes;
