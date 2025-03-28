// three.js port of Fire shadertoy by @Xor
// Original - https://x.com/XorDev/status/1903168199069216954

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Classic Perlin noise implementation
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise2D(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                      -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  // First corner
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);

  // Other corners
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  // Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  // Gradients: 41 points uniformly over a line, mapped onto a diamond.
  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  // Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Use vUv for coordinates normalized to [0,1]
  vec2 uv = vUv;

  // Adjust for aspect ratio
  vec2 r = resolution;

  // Time variable
  float t = time;

  // Main fire effect
  vec2 p = (uv * 2.0 - 1.0) * vec2(r.x/r.y, 1.0); // Centered coordinates with aspect ratio
  vec2 R;

  // Distort the coordinates
  p *= 1.0 - vec2(0.5 * p.y, 0.5 / (1.0 + p * p));
  p.y -= t;

  float F = 11.0;
  float N;
  float d;

  // Multiple iterations of sinusoidal distortion
  for(R.x = F; F < 50.0; F *= 1.2) {
    p += 0.4 * sin(F * dot(p, sin(++R)) + 6.0 * t) * cos(R) / F;
  }

  // Apply noise for organic appearance
  N = snoise2D(p * 4.0);
  d = length(p + vec2(0.0, t + 0.5)) / 0.3 - ++N;
  N += snoise2D(p * 8.0);

  // Final color output with hyperbolic tangent for contrast
  vec4 o = tanh(++N / (0.5 - 0.1 * N + max(d / 0.1, -d) * abs(d) / 0.3) / vec4(1.0, 3.0, 9.0, 1.0));

  // Assign final color
  gl_FragColor = o;
}