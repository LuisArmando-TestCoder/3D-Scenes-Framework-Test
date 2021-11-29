import * as THREE from "three";
import fragmentShader from "../shaders/fragment/rainbow";
import vertexShader from "../shaders/vertex/default";

export default new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader,
});
