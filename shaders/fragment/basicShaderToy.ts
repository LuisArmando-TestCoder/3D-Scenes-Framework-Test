export default `
uniform float iTime;
uniform vec3 iResolution;
varying vec3 fragCoord;

void main() {
    vec2 uv = fragCoord.xy / iResolution.xy;

    vec3 col = .5 + .5 * cos(iTime + uv.xyx + vec3(0., 2., 4.));

    gl_FragColor = vec4(col, 1.);
}
`;