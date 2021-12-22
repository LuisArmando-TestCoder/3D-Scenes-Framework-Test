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
import LightOrbs from "../../meshes/LightOrbs";

export default {
  sky: {
    properties: {
      rotation: {
        z: -Math.PI,
        x: -Math.PI / 2,
      },
      position: {
        y: -500,
      },
    },
    object: () =>
      new THREE.Mesh(
        new THREE.SphereBufferGeometry(1500, 100),
        starfieldMaterial
      ),
  } as unknown as Scene,
  ocean: {
    properties: {
      rotation: {
        y: -Math.PI / 4,
      },
      position: new THREE.Vector3(0, -20, 0),
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
  lights: {
    properties: {
      position: new THREE.Vector3(0, 20, 0),
    },
    object: () =>
      LightOrbs([
        new THREE.Vector3(0, 0, 40),
        new THREE.Vector3(20, 0, 40),
        new THREE.Vector3(-20, 0, 40),
      ]),
    onAnimation({ object3D }: SceneExport) {
      const distance = .5;
      object3D.children.forEach((child, index) => {
        const indexNormal = index / object3D.children.length;
        const step = new Date().getTime() / 500 + indexNormal;
        child.position.y += Math.cos(step) * distance;
        child.position.x += Math.sin(step / 2) * distance;
      });
    },
  } as unknown as Scene,
  floor: {
    properties: {
      position: {
        y: -3,
      },
    },
    object: () =>
      new THREE.Mesh(
        new THREE.CylinderGeometry(45, 45, 1, 100),
        new THREE.MeshPhongMaterial({
          color: "#000",
          specular: "#fff",
          shininess: 30,
        })
        // getQuixelMaterial({
        //   multiplyScalar: 7.5,
        //   name: "Marble_Polished",
        //   code: "vdfjbfvv",
        // })
      ),
  } as unknown as Scene,
  // bench: {
  //   properties: {
  //     position: {
  //       y: -2.5,
  //     },
  //   },
  //   object: () => Model("./models/gltf/bench_minecraft/scene.gltf"),
  //   onSetup: console.log,
  // } as unknown as Scene,
  // horse: {
  //   properties: {
  //     position: {
  //       y: -2.5,
  //     },
  //   },
  //   object: () => Model("./models/gltf/minecraft_-_hell_horse_yitrium/scene.gltf"),
  //   onSetup: console.log,
  // } as unknown as Scene,
  // king: {
  //   properties: {
  //     position: {
  //       y: -2.5,
  //     },
  //   },
  //   object: () => Model("./models/gltf/minecraft_-_mexican_king_maximiliano_i/scene.gltf"),
  //   onSetup: console.log,
  // } as unknown as Scene,
  // executioner: {
  //   properties: {
  //     position: {
  //       y: -2.5,
  //     },
  //   },
  //   object: () => Model("./models/gltf/minecraft_-_necrosed_executioner_mob_idea/scene.gltf"),
  //   onSetup: console.log,
  // } as unknown as Scene,
} as Scenes;
