// Fixed version matching coordinate handling of working shader

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    // Get the normalized coordinates
    vec2 uv = vUv;
    vec2 r = resolution;
    float t = time;
    
    // Center and adjust for aspect ratio - this matches the working shader
    vec2 p = (uv * 2.0 - 1.0) * vec2(r.x/r.y, 1.0);
    
    // Initialize variables for the algorithm
    vec2 l = vec2(0.0); 
    vec4 o = vec4(0.0);
    
    // Initial calculation - using the exact toy format logic with proper init
    l += abs(0.7 - dot(p, p));
    vec2 v = p * (1.0 - l) / 0.2;
    
    // Loop with proper initialization - following toy format algorithm
    for(float i = 0.0; i < 8.0; i += 1.0) {
        // Add color contribution - use the 0.2 factor from toy
        o += (sin(vec4(v.x, v.y, v.y, v.x)) + 1.0) * abs(v.x - v.y) * 0.2;
        
        // Update v - protect against division by zero
        float safeI = max(i, 0.001);
        v += cos(v.yx * i + vec2(0.0, i) + t) / safeI + 0.7;
    }
    
    // Final calculation - match the toy format but protect division
    o = tanh(exp(p.y * vec4(1.0, -1.0, -2.0, 0.0)) * exp(-4.0 * l.x) / max(o, vec4(0.001)));
    
    // Output
    gl_FragColor = o;
}