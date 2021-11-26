import * as THREE from "three";
import { CanvasState } from "scene-preset/lib/types/state";

export type Object3D = THREE.Mesh | THREE.Group | THREE.Object3D;
export type SceneObject = {
  properties?: {
    position?: THREE.Vector3;
    rotation?: THREE.Vector3;
    scale?: THREE.Vector3;
  };
  object?: () => Promise<Object3D> | Object3D;
  onAnimation?: (object: Object3D, canvasState: CanvasState) => {};
  onSetup?: (object: Object3D, canvasState: CanvasState) => {};
};
export type SceneObjects = {
  [index: string]: SceneObject;
};

export default async (sceneObjects: SceneObjects) => {
  const sceneGroup = new THREE.Group();

  const objectRequests = Object.keys(sceneObjects).map(async (key: string) => {
    const sceneObject: SceneObject = sceneObjects[key];
    let object: Object3D = new THREE.Object3D();

    // assign bare object
    const retrievedObject = sceneObject?.object?.();

    if (retrievedObject instanceof THREE.Object3D) {
      object = retrievedObject;
    }

    // Assign object as a promise
    const promisedObject = retrievedObject as Promise<Object3D>;

    if (typeof promisedObject?.then === "function") {
      object = await promisedObject;
    }

    // assign object main vectors
    (["position", "scale", "rotation"] as const).forEach((property) => {
      const defaultValue = property === "scale" ? 1 : 0;

      object[property].set(
        (sceneObject.properties?.[property]?.x as number) || defaultValue,
        (sceneObject.properties?.[property]?.y as number) || defaultValue,
        (sceneObject.properties?.[property]?.z as number) || defaultValue
      );
    });

    object.name = key;

    return object;
  });

  (await Promise.all(objectRequests)).forEach((object) => {
    sceneGroup.add(object);
  });

  const executeObjectsEvents = (
    canvasState: CanvasState,
    callType: "onSetup" | "onAnimation"
  ) => {
    Object.keys(sceneObjects).forEach((key: string) => {
      sceneObjects[key][callType]?.(
        sceneGroup.getObjectByName(key) as Object3D,
        canvasState
      );
    });
  };

  return {
    sceneGroup,
    onSetup(canvasState: CanvasState) {
      canvasState?.scene?.add(sceneGroup);

      executeObjectsEvents(canvasState, "onSetup");
    },
    onAnimation(canvasState: CanvasState) {
      executeObjectsEvents(canvasState, "onAnimation");
    },
  };
};
