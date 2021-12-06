export default `
uniform float iTime;
uniform vec3 iResolution;
varying vec3 fragCoord;

const float PI = 3.14159265358979323846264338327950288;

vec2 wavyFlare(vec2 uv) {
    return (uv + .5) + cos(iTime) / 12.;
}

float waveLine(vec2 uv, float waveThickness, float waveFrequency, float waveCenter) {
    return max(
        min(
            1.,
            smoothstep(
                (waveThickness * (waveFrequency / (waveCenter * 10.)))
                + waveCenter - waveThickness,
                uv.y + sin(uv.x * waveFrequency) / waveFrequency,
                waveCenter + waveThickness
            ) + smoothstep(
                waveCenter - waveThickness,
                uv.y + sin(uv.x * waveFrequency) / waveFrequency,
                waveCenter + waveThickness
            )
        ),
        .0
    );
}

void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord.xy/vec2(
        iResolution.x * (iResolution.y / iResolution.x),
        iResolution.y
    );
    

    vec2 color = vec2(
        waveLine(
            uv, 
            .000075 * wavyFlare(uv).y, 
            5000., // frequency
            0. // position
        )
    );

    // Output to screen
    gl_FragColor = vec4(color, sin(color.x), 1.);

    float colorThreshold = .00001;

    if (color.x < colorThreshold && color.y < colorThreshold) {
        gl_FragColor.a = 0.;
        discard;
    } 
    // no objects can collide with the sight of the discarded one
}
`;
