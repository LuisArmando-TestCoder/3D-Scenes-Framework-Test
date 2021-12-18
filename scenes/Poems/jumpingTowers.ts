import * as THREE from "three";
import { consulters } from "scene-preset";

export default (amount = 5, thickness = 1, height = 1) => {
  return consulters.getProceduralGroup([
    {
      geometry: new THREE.BoxBufferGeometry(
        thickness * 0.5,
        height,
        thickness * 0.5
      ),
      material: new THREE.MeshStandardMaterial({
        color: "#fff",
      }),
      dimensions: [amount],
      getIntersectionMesh([index], mesh) {
        mesh.position.x = index - amount / 2;
        mesh.scale.y =
          Math.min(
            amount * height,
            1 / (Math.abs(index + 0.5) / amount - 0.5)
          ) * height;

        return mesh;
      },
    },
  ]);
};
