import * as THREE from "three";
import Victor from "victor";
import { consulters, types } from "scene-preset";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";

import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import stage from "../../stages/nightSkyReflectors";

let randomBreakpoints: THREE.Object3D[];

export default {
  ...stage,
  breakpoints: {
    properties: {
      position: {
        y: -1.5,
      },
    },
    object: async () => {
      randomBreakpoints = getRandomBreakpoints(
        10,
        45,
        (await Model("./models/gltf/candy_cane/scene.gltf")).object3D
      );

      const scale = .5

      randomBreakpoints.forEach((breakpoint) => {
        breakpoint.scale.set(scale, scale, scale);
      });

      return randomBreakpoints;
    }, // compartir a un estado global de otras escenas?
  } as unknown as Scene,
  character: {
    properties: {
      position: {
        y: -1.5,
      },
    },
    object: () => Model("./models/gltf/fox_minecraft/scene.gltf"),
    onSetup({ object3D }: SceneExport) {
      object3D.children[0].rotation.z = Math.PI / 2;
    },
    onAnimation({ object3D, animations }: SceneExport) {
      if (randomBreakpoints) {
        pursueBreakpoints({
          breakpoints: randomBreakpoints,
          object3D,
          animations,
        });
      }
    },
  } as unknown as Scene,
} as Scenes;

// Crea una carrera de obstáculos donde cambias el target para que el fox siga los breakpoints
// Crea o busca una función que genera desplazamientos 2D en bezier curbes
// Make the fox jump
function getRandomBreakpoints(
  amount: number,
  distance: number,
  mesh: THREE.Object3D = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.25, 100, 100),
    new THREE.MeshBasicMaterial({
      color: "#f00",
    })
  )
) {
  return [...new Array(amount)].map(() => {
    const step = Math.random() * Math.PI * 2;
    const randomDistance = distance * Math.random();
    const clone = mesh.clone();

    clone.position.x = Math.sin(step) * randomDistance;
    clone.position.z = Math.cos(step) * randomDistance;

    return clone;
  });
}

function distanceBetween(vector1: THREE.Vector3, vector2: THREE.Vector3) {
  return new Victor(vector1.x, vector1.z).distance(
    new Victor(vector2.x, vector2.z)
  );
}

function pursueBreakpoints({
  breakpoints,
  object3D,
  animations,
  minimumDistance = 1,
  speedScale = 0.1,
}: {
  breakpoints: THREE.Object3D[];
  object3D: THREE.Object3D;
  animations: Map<string, (number: number) => THREE.AnimationAction>;
  minimumDistance?: number;
  speedScale?: number;
}) {
  let closestVisibleBreakpoint: THREE.Object3D | null = null;
  let lastCheckedDistance = Infinity;

  for (const breakpoint of breakpoints) {
    const distance = distanceBetween(object3D.position, breakpoint.position);

    if (breakpoint.visible && distance < lastCheckedDistance) {
      closestVisibleBreakpoint = breakpoint;
      lastCheckedDistance = distance;
    }
  }

  if (closestVisibleBreakpoint) {
    if (
      distanceBetween(closestVisibleBreakpoint.position, object3D.position) <=
      minimumDistance
    ) {
      closestVisibleBreakpoint.visible = false;
    }

    approachTarget({
      target: closestVisibleBreakpoint.position,
      object3D,
      animations,
      speedScale,
      minimumDistance,
    });
  }
}

function approachTarget({
  target,
  object3D,
  animations,
  minimumDistance = 2,
  speedScale = 0.01,
}: {
  target: THREE.Vector3;
  object3D: THREE.Object3D;
  animations: Map<string, (number: number) => THREE.AnimationAction>;
  minimumDistance?: number;
  speedScale?: number;
}) {
  const distance = distanceBetween(target, object3D.position);
  const run = animations?.get?.("Run")?.((distance * speedScale) / 10);

  if (distance >= minimumDistance) {
    object3D.lookAt(target.x, -1.5, target.z);

    object3D.position.x += speedScale * (target.x - object3D.position.x);
    object3D.position.z += speedScale * (target.z - object3D.position.z);

    run?.play();

    return;
  }

  run?.stop();
}
