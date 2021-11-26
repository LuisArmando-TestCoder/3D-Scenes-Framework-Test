import * as THREE from "three";
import { consulters } from "scene-preset";

export default function ({ position }: { position: THREE.Vector3 }) {
  const cubesCube = consulters.getProceduralGroup([
    {
      geometry: new THREE.BoxBufferGeometry(0.5, 0.5, 0.5) as any,
      getIntersectionMesh(indices, mesh) {
        mesh.position.set(indices[0], indices[1], indices[2]);

        return mesh;
      },
      dimensions: [3, 3, 3],
    },
  ]);

  cubesCube.position.set(position.x, position.y, position.z);

  return cubesCube;
}
