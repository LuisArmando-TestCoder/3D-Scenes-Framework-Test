import * as THREE from "three";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const loader = new FontLoader();

interface Properties {
  text: string;
  path: string;
  size?: number;
  height?: number;
  color?: string;
}

export default ({
  text,
  path,
  size = 6,
  height = 2,
  color = "#000",
}: Properties): Promise<THREE.Mesh> => {
  return new Promise<THREE.Mesh>((resolve, reject) => {
    loader.load(
      path,
      (font: Font) => {
        const geometry = new TextGeometry(text, {
          font,
          size,
          height,
        });
        const textMesh = new THREE.Mesh(geometry, [
          new THREE.MeshStandardMaterial({ color }),
          new THREE.MeshStandardMaterial({ color }),
        ]);

        textMesh.castShadow = true;

        resolve(textMesh);
      },
      undefined,
      reject
    );
  });
};
