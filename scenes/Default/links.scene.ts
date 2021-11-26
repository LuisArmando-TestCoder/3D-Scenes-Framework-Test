import * as THREE from "three";
import { events, actions, consulters } from "scene-preset";
import { SceneObject, SceneObjects } from "./getSceneEvents";
import gsap from "gsap";

import linkImages from "./linkImages.store";
import Image from "../../meshes/Image";
import Text from "../../meshes/Text";

export default {
  text: {
    properties: {
      position: new THREE.Vector3(0, 0, 15),
      rotation: new THREE.Vector3(0, Math.PI, 0),
    },
    object: async () => {
      return await Text({
        text: "TEDx",
        path: "./fonts/Montserrat_Regular.json",
        color: "#f00",
        thickness: .5
      });
    },
  },
  links: {
    properties: {
      position: {
        y: 2,
      },
    },
    object: async () => {
      const redirectObjects = new THREE.Group();
      const distance = Object.entries(linkImages).length * 3;
      let index = 0;

      for (const [redirect, imageURL] of Object.entries(linkImages)) {
        const image = await Image(imageURL, 10);
        const step =
          (++index / Object.entries(linkImages).length) * Math.PI * 2;

        image.position.x = Math.sin(step) * distance;
        image.position.z = Math.cos(step) * distance;

        image.name = redirect;
        image.lookAt(new THREE.Vector3(0, 0, 0));

        redirectObjects.add(image);
      }

      return redirectObjects;
    },
    onSetup(object: THREE.Group) {
      console.log(object);
      object.children.forEach((child) => {
        events.onClickIntersectsObject([child], () => {
          window.open(child.name, "_blank");
        });
      });
    },
  } as unknown as SceneObject,
  tunnelSquares: {
    object: () => {
      return consulters.getProceduralGroup([
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

            if (Math.random() > 0.5) {
              return mesh;
            }
          },
          dimensions: [100, 60],
        },
      ]);
    },
  } as unknown as SceneObject,
  floatingSquares: {
    object: () => {
      return consulters.getProceduralGroup([
        {
          geometry: new THREE.BoxBufferGeometry(0.25, 0.25, 0.25) as any,
          material: new THREE.MeshStandardMaterial({
            color: "#f00",
          }),
          getIntersectionMesh(indices, mesh) {
            mesh.position.set(
              Math.sin((indices[0] / 5) * Math.PI * 2) * Math.random() * 50,
              (indices[1] - 2.5) * 10,
              Math.cos((indices[2] / 5 + Math.random()) * Math.PI * 2) *
                Math.random() *
                50
            );

            return mesh;
          },
          dimensions: [5, 5, 5],
        },
      ]);
    },
    onSetup(squares: THREE.Group) {
      squares.children.forEach((element: THREE.Object3D) => {
        gsap.timeline().to(element.position, {
          y: element.position.y + Math.random() * 10,
          duration: 10,
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
} as SceneObjects;
