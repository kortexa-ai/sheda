// Shadertoy by @Xor https://x.com/XorDev/status/1894123951401378051

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    // Get the normalized coordinates
    vec2 uv = vUv;
    vec2 r = resolution;
    float t = time;
    
    // Center and adjust for aspect ratio (FC.xy in shadertoy = fragment coordinate)
    vec2 p = (uv * 2.0 - 1.0) * vec2(r.x/r.y, 1.0);
    
    // Initialize variables for the algorithm
    vec2 l = vec2(0.0); 
    vec2 i = vec2(0.0);
    vec4 o = vec4(0.0);
    
    // Initial pattern distortion based on distance from center
    l = vec2(4.0 - 4.0 * abs(0.7 - dot(p, p)));
    
    // Main pattern vector
    vec2 v = p * l;
    
    // Iterative pattern generation
    for(i.y = 0.0; i.y < 8.0; i.y++) {
        // Build up the color from sinusoidal patterns
        o += (sin(vec4(v.x, v.y, v.y, v.x)) + 1.0) * abs(v.x - v.y);
        
        // Update pattern with wave motion based on time
        v += cos(v.yx * i.y + i + t) / (i.y + 1.0) + 0.7;
    }
    
    // Final color transformation with exponential and hyperbolic functions
    o = tanh(5.0 * exp(l.x - 4.0 - p.y * vec4(-1.0, 1.0, 2.0, 0.0)) / (o + 0.001));
    
    // Output the final color
    gl_FragColor = o;
}