// Shadertoy mountains shader adapted for three.js

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Helper function for HSV to RGB conversion
vec3 hsv(float h, float s, float v) {
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main() {
    // Initialize output color
    vec4 o = vec4(0.0, 0.0, 0.0, 1.0);
    
    // Get the normalized coordinates with aspect ratio correction
    vec2 uv = vUv;
    vec2 r = resolution;
    float t = time;
    
    // Setup variables
    float i = 0.0;       // iterator
    float e = 0.0;       // elevation
    float g = 0.0;       // gradient accumulator
    float R = 0.0;       // ray length
    float s = 0.0;       // scale
    
    // Initialize ray direction (d) and position (q)
    // Transform vUv to be centered like fragment coordinates in ShaderToy
    vec3 q = vec3(0.0, 0.0, -1.0);
    vec3 p = vec3(0.0);
    vec3 d = vec3((vUv * 2.0 - 1.0) * vec2(r.x/r.y, 1.0), 1.0);
    
    // Main ray marching loop
    for(; i < 129.0; i++) {
        e += i / 8e5;
        o.rgb += hsv(0.58, R + g * 0.3, e * i / 40.0);
        s = 4.0;
        p = q += d * e * R * 0.3 + 2e-5;
        g += p.y / s;
        p = vec3(log2(R = length(p)) - t * 0.2, exp2(mod(-p.z, s) / R) - 0.15, p);
        
        // Fractal terrain calculation
        for(e = --p.y; s < 1e3; s += s) {
            e += -abs(dot(sin(p.yzx * s), cos(p.xzy * s)) / s * 0.5);
        }
    }
    
    // Output final color
    gl_FragColor = o;
}