import * as THREE from "three";
import { events, consulters } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { SceneObject, SceneObjects } from "./getSceneEvents";
import rainbowMaterial from "../../materials/rainbow";
import gsap from "gsap";

import linkImages from "./linkImages.store";
import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import PointLightSet from "../../meshes/PointLightSet";

export default {
  discoPlanet: {
    properties: {
      position: new THREE.Vector3(0, 200, 0),
    },
    object: () =>
      consulters.getProceduralGroup([
        {
          geometry: new THREE.TorusBufferGeometry(1, .1, 3, 100),
          material: rainbowMaterial,
          dimensions: [250],
          getIntersectionMesh([index], mesh) {
            const size = 250;
            const rescale = 15;
            const step = (index / size - .5) * Math.PI * 2
            const scaleY1 = Math.cos(step) * rescale;
            const scaleY2 = Math.sin(step) * rescale;

            mesh.position.y = scaleY1;
            mesh.scale.set(scaleY2, scaleY2, 0);
            mesh.rotateX(Math.PI / 2);

            return mesh;
          },
        },
        {
          geometry: new THREE.TorusBufferGeometry(10, .1, 10, 100),
          material: rainbowMaterial,
          dimensions: [3],
          getIntersectionMesh([index], mesh) {
            const size = 3;
            const rescale = 1.5;
            const step = (index / size - .5) * Math.PI * 2
            const scaleY2 = Math.sin(step) * rescale;

            mesh.scale.set(3.5 + scaleY2, 3.5 + scaleY2, 1);
            mesh.rotateX(Math.PI / 2);

            return mesh;
          },
        },
      ]),
  } as unknown as SceneObject,
  links: {
    properties: {
      position: {
        z: 10,
      },
    },
    object: async () => {
      const redirectObjects = new THREE.Group();
      const distance = Object.entries(linkImages).length * 3;
      let index = 0;

      for (const [name, urls] of Object.entries(linkImages)) {
        const [redirect, imageURL] = urls;
        const image = await Image(imageURL, 10);
        const step =
          (++index / Object.entries(linkImages).length) * Math.PI +
          Math.PI * 1.45;
        // Math.PI * 2 for full circle
        // + Math.PI * 1.5 so it starts in front of first view

        image.position.x = Math.sin(step) * distance;
        image.position.z = Math.cos(step) * distance;
        image.name = redirect;

        image.lookAt(new THREE.Vector3(0, 0, 0));

        redirectObjects.add(image);

        const text = await Text({
          text: name,
          path: "./fonts/Montserrat_Regular.json",
          color: "#f00",
          thickness: 0.1,
          size: 0.5,
        });

        text.position.x = Math.sin(step) * (distance * 0.99);
        text.position.z = Math.cos(step) * (distance * 0.99);
        text.name = redirect;

        text.lookAt(new THREE.Vector3(0, 0, 0));

        redirectObjects.add(text);
      }

      return redirectObjects;
    },
    onSetup(object: THREE.Group) {
      object.children.forEach((child) => {
        events.onClickIntersectsObject([child], () => {
          window.open(child.name, "_blank");
        });
      });
    },
  } as unknown as SceneObject,
  tunnelSquares: {
    object: () =>
      consulters.getProceduralGroup([
        {
          geometry: new THREE.BoxBufferGeometry(10, 10, 10),
          material: new THREE.MeshStandardMaterial({
            color: "#aaa",
          }),
          getIntersectionMesh(indices, mesh) {
            const step = (indices[1] / 60) * Math.PI * 2;
            const size = 10;
            const y = (indices[0] - 50) * size;
            mesh.position.set(
              Math.sin(step) * (30 / Math.PI) * size,
              y,
              Math.cos(step) * (30 / Math.PI) * size
            );
            mesh.lookAt(new THREE.Vector3(0, y, 0));

            if (Math.random() < 0.75) {
              return mesh;
            }
          },
          dimensions: [100, 60],
        },
      ]),
  } as unknown as SceneObject,
  floatingSquares: {
    object: () =>
      consulters.getProceduralGroup([
        {
          geometry: new THREE.BoxBufferGeometry(0.25, 0.25, 0.25) as any,
          material: new THREE.MeshBasicMaterial({
            color: "#f00",
          }),
          getIntersectionMesh(indices, mesh) {
            const size = 5;
            mesh.position.set(
              Math.sin((indices[0] / size) * Math.PI * 2) * Math.random() * 50,
              indices[1] * 10,
              Math.cos((indices[2] / size + Math.random()) * Math.PI * 2) *
                Math.random() *
                50
            );

            return mesh;
          },
          dimensions: [5, 5, 5],
        },
      ]),
    onSetup(squares: THREE.Group) {
      squares.children.forEach((element: THREE.Object3D) => {
        gsap.timeline().to(element.position, {
          y: element.position.y + Math.random() * 20,
          duration: 20,
        });
        events.onClickIntersectsObject([element], () => {
          gsap.timeline().to(element.rotation, {
            x: Math.random() * 10,
            y: Math.random() * 10,
            z: Math.random() * 10,
            duration: 3,
          });
        });
      });
    },
  } as unknown as SceneObject,
  // floor: {
  //   properties: {
  //     position: new THREE.Vector3(0, -5, 0),
  //   },
  //   object: () =>
  //     Floor({
  //       size: new THREE.Vector2(2000, 2000),
  //       multiplyScalar: 100,
  //       textureName: "mahogfloor-bl",
  //       maps: {
  //         baseColor: "mahogfloor_basecolor",
  //         normal: "mahogfloor_normal",
  //         roughness: "mahogfloor_roughness",
  //         ao: "mahogfloor_AO",
  //         bump: "mahogfloor_Height",
  //       },
  //     }),
  //   onSetup(object: THREE.Object3D) {
  //     object.rotateX(Math.PI / 2);
  //   },
  // } as unknown as SceneObject,
  lightSet: {
    object: () =>
      PointLightSet([
        {
          position: new THREE.Vector3(0, 2, 0),
          distance: 50,
          intensity: 3,
        },
        {
          position: new THREE.Vector3(0, 15, 0),
          distance: 50,
          intensity: 3,
        },
      ]),
    onAnimation: (object: THREE.Object3D, canvasState: CanvasState) => {
      object.children[0].position.set(
        canvasState.camera?.position.x as number,
        canvasState.camera?.position.y as number,
        canvasState.camera?.position.z as number
      );
    },
  } as unknown as SceneObject,
} as SceneObjects;
