import * as THREE from "three";
import { consulters } from "scene-preset";
import basicShaderToyMaterial from "../../materials/basicShaderToy";


export default ({
    x, z, size = 10, amount = 70
}: {
    x: number, z: number, size?: number, amount?: number
}) => {

  return consulters.getProceduralGroup([
    {
      geometry: new THREE.BoxBufferGeometry(0.1, size * 0.75, 0.1),
      material: basicShaderToyMaterial,
      dimensions: [size, amount],
      getIntersectionMesh(indices, mesh) {
        const step = (indices[1] / amount) * Math.PI * 2;
        const y = (indices[0] - size / 2) * size;

        mesh.position.set(
          x + (Math.sin(step) * (amount / 2 / Math.PI) * size) / (y / size),
          y,
          z + (Math.cos(step) * (amount / 2 / Math.PI) * size) / (y / size)
        );
        mesh.lookAt(new THREE.Vector3(x, 0, z));

        if (Math.abs(y) > size) {
          return mesh;
        }
      },
    },
  ]);
};
