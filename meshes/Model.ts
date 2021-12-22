import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default (
  path: string
): Promise<{
  object3D: THREE.Group;
  animations: Map<string, (animationSpeed: number) => THREE.AnimationAction>;
}> => {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(
      path,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((object: THREE.Object3D<THREE.Event>) => {
          object.castShadow = true;
        });

        const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);
        const animations: Map<string, (animationSpeed: number) => THREE.AnimationAction> = new Map();

        gltfAnimations.forEach((a: THREE.AnimationClip) => {
          const action = mixer.clipAction(a);

          animations.set(a.name, (animationSpeed: number) => {
            mixer.update(animationSpeed);

            return action;
          });
        });

        resolve({ object3D: model, animations });
      },
      undefined,
      reject
    );
  });
};
