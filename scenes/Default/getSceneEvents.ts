import * as THREE from "three";
import { CanvasState } from "scene-preset/lib/types/state";

export type Object3D = THREE.Mesh | THREE.Group | THREE.Object3D;
export type SceneObject = {
  properties?: {
    position?: THREE.Vector3;
    rotation?: THREE.Vector3;
    scale?: THREE.Vector3;
  };
  object?: () =>
    | Promise<Object3D>
    | Object3D
    | Promise<Object3D>[]
    | Object3D[];
  onAnimation?: (object: Object3D, canvasState: CanvasState) => {};
  onSetup?: (object: Object3D, canvasState: CanvasState) => {};
};
export type SceneObjects = {
  [index: string]: SceneObject;
};

async function getArrayGroup(
  objects: (Object3D | Promise<Object3D>)[],
  key: string,
): Promise<THREE.Group> {
  const group = new THREE.Group();

  for (const [index, innerObject] of Object.entries(objects)) {
    let child: Object3D = innerObject as Object3D;

    if (typeof (innerObject as Promise<Object3D>)?.then === "function") {
      try {
        child = await innerObject;
      } catch {
        throw `Error on object ${key}, on child with index ${index}`;
      }
    }

    if (child instanceof THREE.Object3D) {
      group.add(child);
    }
  }

  return group;
}

function setObjectVectors(object: Object3D, sceneObject: SceneObject) {
  (["position", "scale", "rotation"] as const).forEach((property) => {
    const defaultValue = property === "scale" ? 1 : 0;
    const getAxis = (axisName: "x" | "y" | "z") =>
      (sceneObject.properties?.[property]?.[axisName] as number) ||
      defaultValue;

    object[property].set(getAxis("x"), getAxis("y"), getAxis("z"));
  });
}

export default async (sceneObjects: SceneObjects) => {
  const sceneGroup = new THREE.Group();
  const objectRequests = Object.keys(sceneObjects).map(async (key: string) => {
    const sceneObject: SceneObject = sceneObjects[key];
    let retrievedObject;

    try {
      retrievedObject = sceneObject?.object?.();
    } catch {
      throw `Error on object ${key}`;
    }

    let object: Object3D = retrievedObject as Object3D;

    const promisedObject = retrievedObject as Promise<Object3D>;

    if (typeof promisedObject?.then === "function") {
      try {
        object = await promisedObject;
      } catch {
        throw `Error on promised object ${key}`;
      }
    }

    if (Array.isArray(object)) {
      object = await getArrayGroup(object, key);
    }
    // assign object main vectors
    setObjectVectors(object, sceneObject);

    object.name = key;

    return object;
  });

  (await Promise.all(objectRequests.filter((x) => x))).forEach((object) => {
    object && sceneGroup.add(object);
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
