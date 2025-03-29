// Wrapper for sky.toy.glsl shader

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
  float i = 0.0;
  float e = 0.0;
  float g = 0.0;
  float R = 0.0;
  float s = 0.0;
  vec3 q = vec3(0.0);
  vec3 p = vec3(0.0);
  vec3 d = vec3(FC.xy / r - 0.6, 1.0);
  
  // Initialize q.zy with -1
  q.z = -1.0;
  q.y = -1.0;
  
  // Main loop
  for(i = 0.0; i < 99.0; i += 1.0) {
    e += i / 800000.0;
    // Apply HSV color, avoiding division by zero with R
    o.rgb += hsv(0.6, max(R, 0.001) + g * 0.3, e * i / 40.0);
    s = 4.0;
    // Here R might be undefined on first iteration, so use max
    p = q += d * e * max(R, 0.001) * 0.2;
    g += p.y / s;
    
    // Calculate R from length of p
    R = length(p);
    
    // Use R to calculate p
    p = vec3(R - 0.5 + sin(t) * 0.02, exp2(mod(- p.z, s) / max(R, 0.001)) - 0.2, p);
    
    // Inner loop
    e = p.y - 1.0; // Equivalent to -- p.y
    for(s = 4.0; s < 1000.0; s += s) {
      e += 0.03 - abs(dot(sin(p.yzx * s), cos(p.xzz * s)) / s * 0.6);
    }
  }
  
  fragColor = o;
}

void main() {
  // Get normalized device coordinates
  vec2 fragCoord = vUv * iResolution.xy;
  
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  mainImage(color, fragCoord);
  gl_FragColor = color;
}