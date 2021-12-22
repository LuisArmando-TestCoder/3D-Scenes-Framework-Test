import PointLightSet from "./PointLightSet";
import * as THREE from "three";


// const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
// const bloomLayer = new THREE.Layers();

// bloomLayer.set( BLOOM_SCENE );

// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// const bloomParameters = {
//   exposure: 1,
//   bloomStrength: 6,
//   bloomThreshold: 0,
//   bloomRadius: 1
// };

// const bloomPass = new UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   1.5,
//   0.4,
//   0.85
// );
// bloomPass.threshold = bloomParameters.bloomThreshold;
// bloomPass.strength = bloomParameters.bloomStrength;
// bloomPass.radius = bloomParameters.bloomRadius;
// const renderScene = new RenderPass(scene, camera);
// const bloomComposer = new EffectComposer(renderer);
// bloomComposer.renderToScreen = false;
// bloomComposer.addPass(renderScene);
// bloomComposer.addPass(bloomPass);

// const finalPass = new ShaderPass(
//   new THREE.ShaderMaterial({
//     uniforms: {
//       baseTexture: { value: null },
//       bloomTexture: { value: bloomComposer.renderTarget2.texture },
//     },
//     vertexShader: `
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//     }
//     `,
//     fragmentShader: `
//     uniform sampler2D baseTexture;
//     uniform sampler2D bloomTexture;
//     varying vec2 vUv;
//     void main() {
//       gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
//     }
//     `,
//     defines: {},
//   }),
//   "baseTexture"
// );
// finalPass.needsSwap = true;

// const finalComposer = new EffectComposer( renderer );
// 			finalComposer.addPass( renderScene );
// 			finalComposer.addPass( finalPass );

// function darkenNonBloomed( obj ) {
//   if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
//     materials[ obj.uuid ] = obj.material;
//     obj.material = darkMaterial;
//   }
// }

// function renderBloom( mask ) {
//   if ( mask === true ) {
//     scene.traverse( darkenNonBloomed );
//     bloomComposer.render();
//     scene.traverse( restoreMaterial );
//   } else {
//     camera.layers.set( BLOOM_SCENE );
//     bloomComposer.render();
//     camera.layers.set( ENTIRE_SCENE );
//   }
// }



// function restoreMaterial( obj ) {
//   if ( materials[ obj.uuid ] ) {
//     obj.material = materials[ obj.uuid ];
//     delete materials[ obj.uuid ];
//   }
// }

// window.onresize = function () {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
//   renderer.setSize( width, height );
//   bloomComposer.setSize( width, height );
//   finalComposer.setSize( width, height );
//   render();
// };

export default (positions: THREE.Vector3[], color = "#fff", size = 0.65) => {
  const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });

  return positions.map(({ x, y, z }) => {
    const orb = new THREE.Mesh(
      new THREE.SphereBufferGeometry(size, 100, 100),
      new THREE.MeshBasicMaterial({ color })
    );
    const light = PointLightSet([
      {
        position: new THREE.Vector3(0),
        color,
        decay: 2
      },
    ]);
    const lightOrb = new THREE.Group();

    lightOrb.add(orb);
    lightOrb.add(light);
    lightOrb.position.set(x, y, z);
    lightOrb.name = "lightOrb";

    return lightOrb;
  });
};
