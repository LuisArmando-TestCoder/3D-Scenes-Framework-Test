import * as THREE from "three";
import fragmentShader from "../shaders/fragment/psychedelicSakura";
import vertexShader from "../shaders/vertex/default";

export default new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  // transparent: true,
  // blending: THREE.NormalBlending,
  fragmentShader,
  vertexShader,
});
