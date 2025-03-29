// Wrapper for blackhole.toy.glsl shader

uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

// HSV to RGB conversion
vec3 hsv(float h, float s, float v) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);
  return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 FC = fragCoord;
  vec2 r = iResolution.xy;
  float t = iTime;
  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);
  
  // Initialize variables used in the shader
  vec2 p = (FC.xy * 2.0 - r) / r.y;  // First part of the calculation
  vec2 l = vec2(0.0);                // Initialize l before +=
  l += abs(0.7 - dot(p, p));         // Execute the += operation
  vec2 v = p * (1.0 - l) / 0.2;      // Calculate v with updated l
  
  // Loop
  for(float i = 0.0; i < 8.0; i += 1.0) {
    o += (sin(v.xyyx) + 1.0) * abs(v.x - v.y) * 0.2;
    // Avoid division by zero by ensuring i is at least 0.001
    float safeI = max(i, 0.001);
    v += cos(v.yx * i + vec2(0.0, i) + t) / safeI + 0.7;
  }
  
  // Final calculation - avoid division by zero with max
  o = tanh(exp(p.y * vec4(1.0, -1.0, -2.0, 0.0)) * exp(-4.0 * l.x) / max(o, vec4(0.001)));
  
  fragColor = o;
}

void main() {
  // Get normalized device coordinates
  vec2 fragCoord = vUv * iResolution.xy;
  
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  mainImage(color, fragCoord);
  gl_FragColor = color;
}