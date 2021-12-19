import * as THREE from "three";
import { consulters } from "scene-preset";
import basicShaderToyMaterial from "../../materials/basicShaderToy";

const strays = consulters.getProceduralGroup([
  {
    material: basicShaderToyMaterial,
    geometry: new THREE.BoxBufferGeometry(5, 0.1, 0.1),
    dimensions: [3],
    getIntersectionMesh([index], mesh) {
      mesh.position.y = index;
      mesh.rotation.z = Math.PI / 8;

      return mesh;
    },
  },
]);

const ring = consulters.getProceduralGroup([
  {
    dimensions: [22],
    getIntersectionMesh([index]) {
      const mesh = strays.clone();
      const step = (index / 22) * Math.PI * 2;
      const distance = 20;

      mesh.position.x = Math.sin(step) * distance;
      mesh.position.z = Math.cos(step) * distance;
      mesh.lookAt(new THREE.Vector3());

      return mesh;
    },
  },
]);

export default (y: number = 2) => consulters.getProceduralGroup([
  {
    dimensions: [y],
    getIntersectionMesh([index]) {
      const mesh = ring.clone();

      mesh.position.y = index * (y * 2);

      return mesh;
    },
  },
]);
