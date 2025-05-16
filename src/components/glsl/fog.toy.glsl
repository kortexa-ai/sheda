// mod of @XorDev Atlantic - https://x.com/XorDev/status/1922716290545783182
vec3 rotate3D(float d, vec3 axis) {
    axis = normalize(axis);
    float angle = d + axis.x * 0.5 + axis.y * 0.5; // Vary waves with screen position
    return vec3(cos(angle), sin(angle), 1.0); // Simple distortion
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 FC = fragCoord;
    vec2 r = iResolution.xy;
    float t = iTime;
    vec4 o = vec4(0.0, 0.0, 0.0, 1.0);

    vec2 uv = FC / r * 2.0 - 1.0; // Normalized UV (-1 to 1)
    uv.x *= r.x / r.y; // Aspect correction
    vec3 rd = normalize(vec3(uv * 3., 5.)); // Ray direction
    for(float i, d, z = 0.0; i++ < 100.;) { // Start at z=0
        vec3 p = rd * z; // Simple ray march
        for(d = 1.; d < 100.; d /= .7) {
            float wave = sin(p.x + p.z + t * 5.); // Base wave
            p += .7 * sin(p * rotate3D(d, r.xyy) + t + wave) / d; // Wave distortion
            float density = exp(-abs(p.y + 1.0) * 0.3); // Density for volumetric effect
            o += vec4(0.05, 0.1, 0.15, 0.0) * density * 0.02; // Accumulate glow
        }
        z += d = 0.1 + 0.3 * max(d = p.y + p.z * 0.3, -d * 0.1); // Simplified surface
        o += vec4(0.1, 0.2, 0.3, 0.0) * 0.05 / (1.0 + d * d); // Glow near surface
    }
    o = tanh(o / vec4(1, 1, 1, 1) * 0.5); // Softer scaling, equal channels

    fragColor = o;
}