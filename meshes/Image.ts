import * as THREE from "three";

export default function (
  url: string,
  scale: number
): Promise<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>> {
  const textureLoader = new THREE.TextureLoader();
  const imageLoader = new THREE.ImageLoader();

  textureLoader.crossOrigin = "anonymous";
  imageLoader.crossOrigin = "anonymous";

  return new Promise((resolve) => {
    imageLoader.load(url, (image) => {
      const aspectRatio = image.width / image.height;
      const geometry = new THREE.PlaneGeometry(aspectRatio * scale, scale);
      const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(url),
        side: THREE.DoubleSide,
      });

      resolve(new THREE.Mesh(geometry, material));
    });
  });
}
