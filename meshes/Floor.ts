import * as THREE from "three";

const loader = new THREE.TextureLoader();

export function getMap(src: string, originalMap: THREE.Texture) {
  const map = loader.load(src);

  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.copy(originalMap.repeat);

  return map;
}

interface Maps {
  roughness?: string;
  ao?: string;
  normal?: string;
  bump?: string;
  baseColor: string;
}

/**
 * @param textureName /path/like/string
 *
 * Note: The texture image will be kept under a path like
 * /public/textures/[textureName]/[mapName].png
 *
 * @abstract
 * - Valid mapName: baseColor | normal | ao | roughness | bump
 */
export default ({
  textureName,
  maps,
  repeatSet = new THREE.Vector2(3, 1),
  multiplyScalar = 4,
  size = new THREE.Vector2(100, 100),
}: {
  textureName: string;
  maps: Maps;
  repeatSet?: THREE.Vector2;
  multiplyScalar?: number;
  size?: THREE.Vector2;
}) => {
  const getSrc = (name: string) => `./textures/${textureName}/${name}.png`;

  const baseColorSrc = getSrc(maps.baseColor);
  const normalSrc = maps.normal && getSrc(maps.normal);
  const aoSrc = maps.ao && getSrc(maps.ao);
  const roughnessSrc = maps.roughness && getSrc(maps.roughness);
  const bumpSrc = maps.bump && getSrc(maps.bump);

  const map = loader.load(baseColorSrc);

  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatSet.x, repeatSet.y).multiplyScalar(multiplyScalar);

  const normalMap = normalSrc && getMap(normalSrc, map);
  const aoMap = aoSrc && getMap(aoSrc, map);
  const roughnessMap = roughnessSrc && getMap(roughnessSrc, map);
  const bumpMap = bumpSrc && getMap(bumpSrc, map);

  const geometry = new THREE.BoxGeometry(size.x, size.y, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    roughnessMap: roughnessMap as THREE.Texture,
    aoMap: aoMap as THREE.Texture,
    normalMap: normalMap as THREE.Texture,
    bumpMap: bumpMap as THREE.Texture,
    map,
  });
  const floor = new THREE.Mesh(geometry, material);

  return floor;
};
