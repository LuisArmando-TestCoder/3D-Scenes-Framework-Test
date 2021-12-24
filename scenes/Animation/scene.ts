import * as THREE from "three";
import { consulters } from "scene-preset";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";

import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import stage from "../../stages/nightSkyReflectors"

export default {
  ...stage
} as Scene;