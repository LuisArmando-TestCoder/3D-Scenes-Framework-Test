import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default (path: string): Promise<THREE.Group> => {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(
      path,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((object: THREE.Object3D<THREE.Event>) => {
          object.castShadow = true;
        });

        resolve(model);
      },
      undefined,
      reject
    );
  });
};
