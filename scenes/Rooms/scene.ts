import * as THREE from "three";
import { events, consulters, actions } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import rainbowMaterial from "../../materials/rainbow";
import gsap from "gsap";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../materials/getTextureMaterial";
import PointLightSet from "../../meshes/PointLightSet";

export default {
  spaceModule: {
    properties: {
      position: new THREE.Vector3(0, 0, 25),
      scale: new THREE.Vector3(3, 3, 3),
    },
    object: async () => {
      const satelliteTemplate = await Model(
        "./models/gltf/satellite_modul/scene.gltf"
      );

      return consulters.getProceduralGroup([
        {
          dimensions: [2, 4, 4],
          getIntersectionMesh([x, y, z]) {
            const size = 25;
            const satellite = satelliteTemplate.object3D.clone();

            satellite.position.set(
              (x - 0.5) * (size / 2),
              y * (size / 12),
              z * (size / 4)
            );

            return satellite as THREE.Object3D as THREE.Mesh;
          },
        },
      ]);
    },
    onAnimation({ object3D: group }: SceneExport, { scene }: CanvasState) {
      group.children.forEach((child) => {
        child.lookAt(
          scene?.getObjectByName("skull")?.position || new THREE.Vector3()
        );
      });
    },
  } as unknown as Scene,
  floor: {
    properties: {
      position: new THREE.Vector3(0, -6, 0),
    },
    object: () =>
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        getTextureMaterial({
          multiplyScalar: 300,
          maps: {
            baseColor: "./textures/mahogfloor-bl/mahogfloor_basecolor.png",
            normal: "./textures/mahogfloor-bl/mahogfloor_normal.png",
            roughness: "./textures/mahogfloor-bl/mahogfloor_roughness.png",
            ao: "./textures/mahogfloor-bl/mahogfloor_AO.png",
            bump: "./textures/mahogfloor-bl/mahogfloor_Height.png",
          },
        })
      ),
    onSetup({ object3D: floor }: SceneExport) {
      floor.rotateX(Math.PI / 2);
    },
  } as unknown as Scene,
  lightFollowers: {
    object: async () =>
      await PointLightSet([
        {
          position: new THREE.Vector3(50, 10, 0),
          color: "#228",
        },
        {
          position: new THREE.Vector3(-50, 10, 0),
          color: "#228",
        },
        {
          position: new THREE.Vector3(0, 10, 50),
          color: "#228",
        },
        {
          position: new THREE.Vector3(0, 10, -50),
          color: "#228",
        },
        {
          position: new THREE.Vector3(0, 10, 0),
          color: "#f00",
        },
      ]),
    onAnimation({ object3D }: SceneExport, { camera }: CanvasState) {
      object3D.position.set(
        camera?.position?.x as number,
        camera?.position?.y as number,
        camera?.position?.z as number
      );
    },
  } as unknown as Scene,
  skull: {
    properties: {
      position: {
        z: 100,
        y: 25,
      },
      rotation: {
        y: Math.PI,
        x: Math.PI * -0.25,
      },
      scale: {
        x: 2,
        y: 2,
        z: 2,
      },
    },
    object: async () => await Model("./models/gltf/skull_salazar/scene.gltf"),
    onSetup({ object3D }: SceneExport) {
      events
        .onKey("g")
        .start(() => {
          gsap.timeline()
          .set(object3D.position, { z: 100, y: 25 })
          .to(object3D.position, { z: 20, y: 5, duration: 16 });
        })
        .end(() => {
          gsap.timeline()
          .set(object3D.position, { z: 100, y: 25 })
        });
    },
  } as unknown as Scene,
  walls: {
    object: () =>
      consulters.getProceduralGroup([
        {
          geometry: new THREE.BoxBufferGeometry(50, 50, 50),
          material: getTextureMaterial({
            multiplyScalar: 5,
            maps: {
              baseColor:
                "./textures/Stone_Floor_virrdbe_2K_surface_ms/virrdbe_2K_Albedo.jpg",
              normal:
                "./textures/Stone_Floor_virrdbe_2K_surface_ms/virrdbe_2K_Normal.jpg",
              roughness:
                "./textures/Stone_Floor_virrdbe_2K_surface_ms/virrdbe_2K_Roughness.jpg",
              ao: "./textures/Stone_Floor_virrdbe_2K_surface_ms/virrdbe_2K_AO.jpg",
              metal:
                "./textures/Stone_Floor_virrdbe_2K_surface_ms/virrdbe_2K_Displacement.jpg",
            },
          }),
          getIntersectionMesh(indices, mesh) {
            const size = 50;
            const doubleSize = size * 2;
            const sideAmount = 10;
            mesh.position.set(
              indices[0] * doubleSize -
                (sideAmount / 2) * doubleSize +
                doubleSize / 2,
              0,
              indices[1] * doubleSize -
                (sideAmount / 2) * doubleSize +
                doubleSize / 2
            );

            return mesh;
          },
          dimensions: [10, 10],
        },
      ]),
  } as unknown as Scene,
} as Scenes;
