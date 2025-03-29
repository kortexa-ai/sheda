// Gradient shader based on clock shader - keeping only the shifting colors

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = (vUv * 2.0 - 1.0);
    uv.x *= resolution.x / resolution.y;
    
    // Time varying pixel color - exactly as in the clock shader
    vec3 psych = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.01, 2.0, 4.0));
    
    // Output the color directly without the clock face mask
    gl_FragColor = vec4(psych, 1.0);
}