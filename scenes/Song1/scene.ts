import Victor from "Victor";
import * as THREE from "three";
import { events, consulters } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import gsap from "gsap";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../materials/getTextureMaterial";
import getQuixelMaterial from "../../materials/getQuixelMaterial";
import wavyMaterial from "../../materials/wavy";
import rainbowMaterial from "../../materials/rainbow";
import PointLightSet from "../../meshes/PointLightSet";

export default {
    astronaut: {
        properties: {
            rotation: {
                x: Math.PI / 2
            },
            // scale: {
            //     x: .001, y: .001, z: .001
            // }
        },
        object: () => Model("./models/gltf/low-poly_falling_astronaut/scene.gltf")
    } as unknown as Scene,
    mandala: {
        object: () => {
            const ringAmount = 32

            return consulters.getProceduralGroup([ 
                {
                    material: new THREE.MeshBasicMaterial({ color: "#000" }),
                    geometry: new THREE.BoxBufferGeometry(3, 1, 1),
                    dimensions: [2, ringAmount, 8],
                    getIntersectionMesh([x, y, z], mesh) {
                        const group = new THREE.Group()

                        mesh.rotateZ(Math.PI / 2 * x)

                        group.add(mesh)

                        const step = y / ringAmount * Math.PI * 2
                        const slope = 2.5
                        const space = 5

                        group.rotation.z = Math.sin(step)
                        group.position.x = Math.sin(step) * (slope + (z + 1) * space)
                        group.position.y = Math.cos(step) * (slope + (z + 1) * space)
                        group.position.z = slope * 2 + z * space

                        return group
                    }
                },
                {
                    material: new THREE.MeshBasicMaterial({ color: "#f00" }),
                    geometry: new THREE.BoxBufferGeometry(6, 1, 1),
                    dimensions: [ringAmount, 20],
                    getIntersectionMesh([y, z], mesh) {
                        const step = y / ringAmount * Math.PI * 2
                        const slope = 5
                        const space = 10

                        mesh.rotation.z = step
                        mesh.position.x = Math.sin(step) * (slope * space)
                        mesh.position.y = Math.cos(step) * (slope * space)
                        mesh.position.z = slope + z * space


                        return mesh
                    }
                }
            ])
        }
    }
} as Scenes;
