from modules.main import executeConditionalPath, createFile

shaderName = input("Shader name: ")

executeConditionalPath(
    f"../shaders/fragment/{shaderName}.ts",
    lambda path: createFile(
        path,
        "export default `\n" +
        "uniform float iTime;\n" +
        "uniform vec3 iResolution;\n" +
        "varying vec3 fragCoord;\n\n" +
        "`;\n"
    )
)

executeConditionalPath(
    f"../materials/{shaderName}.ts",
    lambda path: createFile(
        path,
        "import * as THREE from \"three\";\n" +
        f"import fragmentShader from \"../shaders/fragment/{shaderName}\";\n" +
        "import vertexShader from \"../shaders/vertex/default\";\n" +
        "\n" +
        "export default new THREE.ShaderMaterial({\n" +
        "  side: THREE.DoubleSide,\n" +
        "  // transparent: true,\n" +
        "  // blending: THREE.NormalBlending,\n" +
        "  fragmentShader,\n" +
        "  vertexShader,\n" +
        "});\n"
    )
)


# def findAppendToFile(filename, find, insert):
#     with open(filename, 'r+') as file:
#         lines = file.read()
#         # print("repr(lines)", repr(lines))

#         index = repr(lines).find(find) - 1
#         if index < 0:
#             raise ValueError("The text was not found in the file!")
#         if (repr(lines).find(insert) - 1) > -1:
#             print(f"The text <<{insert}>> was already written into the file!")
#             return

#         length = len(find) - 1
#         oldLinesBefore = lines[:index - 1]
#         oldLinesAfter = lines[index + length:]

#         # print("oldLinesBefore", oldLinesBefore)
#         # print("insert", insert)
#         # print("oldLinesAfter", oldLinesAfter)
# #         file.seek(0)
# #         file.write(oldLinesBefore)
# #         file.write(insert)
# #         file.write(oldLinesAfter)

# # findAppendToFile(f"../scenes/Default/index.ts", "import * as THREE from \"three\";",
# #                  f"import {shaderName}Material from \"../../materials/{shaderName}\";")
# findAppendToFile(f"../scenes/Default/index.ts",
#                  "rainbowMaterial,", f"{shaderName}Material,")
