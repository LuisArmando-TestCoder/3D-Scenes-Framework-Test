import os
import sys
from modules.main import executeConditionalPath, createFile

sceneName = input("Scene name: ")
folderPath = f"../scenes/{sceneName}"

executeConditionalPath(
    folderPath,
    lambda path: os.makedirs(path)
)

executeConditionalPath(
    f"{folderPath}/index.ts",
    lambda path: createFile(
        path,
        "import * as THREE from 'three'\n\n" +

        "import presetScene, { actions } from 'scene-preset'\n\n" +

        "export default (id: string) => presetScene({\n" +
            "\tsetup({ scene }) {},\n" +
            "\tanimate({ scene }) {}\n" +
        "}, `#${id}`)"
    )
)

import modules.export