// Shadertoy mountains shader adapted for three.js
// Original by @YoheiNishitsuji https://x.com/YoheiNishitsuji/status/1905613345727918534

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// ===== TWEAKABLE PARAMETERS =====
// Adjust these values to change the look and performance

// === Performance Settings ===
const int MAX_ITERATIONS = 60;      // [20-100] Higher = more detail but slower performance
const float INNER_LOOP_LIMIT = 128.0; // [32-256] Higher = more detail in terrain

// === Animation Settings ===
const float TIME_SCALE = 0.15;      // [0.05-0.3] Speed of animation/movement

// === Visual Settings ===
const float HUE = 0.58;             // [0.0-1.0] Base color hue (0.58=blue-green, 0=red, 0.33=green, 0.66=blue)
const float COLOR_INTENSITY = 1.0;  // [0.5-2.0] Brightness multiplier for colors
const float SATURATION_SCALE = 0.3; // [0.1-0.5] How much saturation varies with the landscape
const float ELEVATION_SCALE = 8e5;  // [1e5-1e6] Controls mountain height (lower=taller)
const float BRIGHTNESS_SCALE = 40.0; // [20-60] Controls overall brightness

// === Camera & Movement Settings ===
const vec3 CAMERA_POSITION = vec3(0.0, 0.0, -1.0); // Starting camera position
const float STEP_SIZE = 0.3;        // [0.1-0.5] How fast we move through the scene
const float TERRAIN_MOTION_SPEED = 0.2; // [0.1-0.4] Speed of terrain scrolling

// === Fog Effect ===
const float FOG_DENSITY = 1.5;      // [0.5-3.0] Density of distance fog
const float FOG_AMOUNT = 0.6;       // [0.0-1.0] How much fog to apply (0=none, 1=maximum)
const vec3 FOG_COLOR_HORIZON = vec3(0.0, 0.0, 0.1); // Color at horizon
const vec3 FOG_COLOR_ZENITH = vec3(0.0, 0.0, 0.0);  // Color at top of screen

// ================================

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
    float t = time * TIME_SCALE;

    // Setup variables
    float i = 0.0;       // iterator
    float e = 0.0;       // elevation
    float g = 0.0;       // gradient accumulator
    float R = 0.0;       // ray length
    float s = 0.0;       // scale

    // Initialize ray direction (d) and position (q)
    vec3 q = CAMERA_POSITION;
    vec3 p = vec3(0.0);
    vec3 d = vec3((vUv * 2.0 - 1.0) * vec2(r.x/r.y, 1.0), 1.0); // ray direction

    // Main ray marching loop
    for(int j = 0; j < MAX_ITERATIONS; j++) {
        i = float(j);

        // Accumulate elevation
        e += i / ELEVATION_SCALE;

        // Accumulate color
        o.rgb += hsv(HUE, R + g * SATURATION_SCALE, e * i / BRIGHTNESS_SCALE) * COLOR_INTENSITY;

        // Set scale and update position
        s = 4.0;
        p = q += d * e * max(R, 0.01) * STEP_SIZE + 2e-5; // Ray marching step

        // Accumulate gradient
        g += p.y / s;

        // Transform the point based on ray length and time
        p = vec3(log2(R = length(p)) - t * TERRAIN_MOTION_SPEED, exp2(mod(-p.z, s) / R) - 0.15, p);

        // Terrain calculation - fractal noise based on sine waves
        float tempE = --p.y;
        for(s = 4.0; s < INNER_LOOP_LIMIT; s += s) {
            tempE += -abs(dot(sin(p.yzx * s), cos(p.xzy * s)) / s * 0.5);
        }
        e = tempE;
    }

    // Apply fog effect
    float fogFactor = 1.0 - exp(-length(o.rgb) * FOG_DENSITY);
    vec3 fogColor = mix(
        FOG_COLOR_HORIZON, // Horizon color
        FOG_COLOR_ZENITH,  // Zenith color
        uv.y
    );

    o.rgb = mix(o.rgb, fogColor, fogFactor * FOG_AMOUNT);

    // Output final color
    gl_FragColor = o;
}