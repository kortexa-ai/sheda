// Simple texture test shader
// Works with the ShaderToy component to test texture uniforms

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0; // This is the texture we'll be using
varying vec2 vUv;

void main() {
    // Get normalized coordinates
    vec2 uv = vUv;
    
    // Apply some transformation to make the texture move/zoom
    // This helps verify the texture is actually working
    float scale = 1.0 + 0.2 * sin(time);
    vec2 transformedUv = (uv - 0.5) * scale + 0.5;
    
    // Sample the texture
    vec4 texColor = texture2D(iChannel0, transformedUv);
    
    // Add a time-based color tint to make it more interesting
    vec3 tint = 0.5 + 0.5 * cos(time + uv.xyx + vec3(0, 2, 4));
    
    // Combine texture and tint
    gl_FragColor = vec4(texColor.rgb * tint, texColor.a);
}