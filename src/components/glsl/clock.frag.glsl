#define PI 3.14159

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

float circle(vec2 uv, vec2 pos, float radius, float blur) {
    return 1.0 - smoothstep(radius, radius + blur + 0.001, length(uv - pos));
}

float defaultBlur = 0.005;

void main() {
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = (vUv * 2.0 - 1.0);
    uv.x *= resolution.x / resolution.y;
    
    // Time varying pixel color
    vec3 psych = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.01, 2.0, 4.0));
    
    // Get current date/time from time uniform
    // Extract seconds, minutes, hours
    float totalSeconds = time;
    float seconds = mod(totalSeconds, 60.0) / 60.0 * PI * 2.0;
    float minutes = mod(totalSeconds / 60.0, 60.0) / 60.0 * PI * 2.0;
    float hours = mod(totalSeconds / 3600.0, 12.0) / 12.0 * PI * 2.0;
    
    // ClockFace
    float circles = circle(uv, vec2(0.0, 0.0), 0.2, defaultBlur);
    
    // seconds hand
    circles += circle(uv, vec2(sin(seconds) / 5.0, cos(seconds) / 5.0), 0.025, defaultBlur);
    
    // Minutes hand
    circles += circle(uv, vec2(sin(minutes) / 3.0, cos(minutes) / 3.0), 0.04, defaultBlur);
    circles += circle(uv, vec2(sin(minutes) / 2.5, cos(minutes) / 2.5), 0.04, defaultBlur);
    
    // hours hand - fixed typo in original (cos(minutes) -> cos(hours))
    circles += circle(uv, vec2(sin(hours) / 5.0, cos(hours) / 5.0), 0.03, defaultBlur);
    
    // using circle as a mask
    vec4 col = mix(vec4(psych, 1.0), vec4(1.0), circles);
    
    // Output to screen
    gl_FragColor = col;
}