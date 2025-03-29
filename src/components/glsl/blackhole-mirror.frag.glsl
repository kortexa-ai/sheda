// Mirroring the working blackhole.frag.glsl but with the exact toy algorithm

uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

void main() {
    // Get the normalized coordinates
    vec2 uv = vUv;
    vec2 r = iResolution;
    float t = iTime;
    
    // Calculate fragment coordinates matching FC.xy in shader toy
    vec2 FC = uv * r;
    
    // Use the exact calculation from the working shader for p
    vec2 p = (FC.xy * 2.0 - r) / r.y;
    
    // Initialize all variables explicitly
    vec2 l = vec2(0.0);
    vec4 o = vec4(0.0, 0.0, 0.0, 0.0);
    
    // Do the += operation separately after initialization
    l += abs(0.7 - dot(p, p));
    
    // Calculate v using the initialized values
    vec2 v = p * (1.0 - l) / 0.2;
    
    // Use a normal for loop with properly initialized counter
    for(float i = 0.0; i < 8.0; i += 1.0) {
        // Add to output - note: toy uses a factor of 0.2
        o += (sin(vec4(v.x, v.y, v.y, v.x)) + 1.0) * abs(v.x - v.y) * 0.2;
        
        // Update v - make sure to guard against division by zero
        float safeI = max(i, 0.001);
        v += cos(v.yx * i + vec2(0.0, i) + t) / safeI + 0.7;
    }
    
    // Final calculation - use the exact toy version with division by zero protection
    o = tanh(exp(p.y * vec4(1.0, -1.0, -2.0, 0.0)) * exp(-4.0 * l.x) / max(o, vec4(0.001)));
    
    // Output
    gl_FragColor = o;
}