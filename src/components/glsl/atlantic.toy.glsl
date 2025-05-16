// // mod of @XorDev Atlantic - https://x.com/XorDev/status/1922716290545783182
// mat3 rotate3D(const in float r, in vec3 a) {
//     a = normalize(a);
//     float s = sin(r);
//     float c = cos(r);
//     float oc = 1.0 - c;
//     vec3 col1 = vec3(oc * a.x * a.x + c, oc * a.x * a.y + a.z * s, oc * a.z * a.x - a.y * s);
//     vec3 col2 = vec3(oc * a.x * a.y - a.z * s, oc * a.y * a.y + c, oc * a.y * a.z + a.x * s);
//     vec3 col3 = vec3(oc * a.z * a.x + a.y * s, oc * a.y * a.z - a.x * s, oc * a.z * a.z + c);
//     return mat3(col1, col2, col3);
// }

// void mainImage(out vec4 fragColor, in vec2 fragCoord) {
//     vec2 FC = fragCoord; // Fragment coordinates
//     vec2 r = iResolution.xy; // Resolution of the screen
//     float t = iTime; // Time variable for animation
//     vec4 o = vec4(0.0, 0.0, 0.0, 1.0); // Output color, initialized to black with full opacity

//     // Check if the fragment is in the bottom fifth of the screen
//     float viewportHeight = r.y * 0.8; // 20% of the height
//     if(FC.y < viewportHeight) {
//         float i = 0., d = 0., z = 3.; // Initialize loop counters and starting depth
//         for(; i++ < 1e2; o += 1.2 / d / z) { // Outer loop, runs 100 times, accumulating color
//             vec3 p = z * (vec3(FC, 1.0) * 2. - r.xyy) / r.y; // Position vector: x-y plane, z=0
//             for(d = 1.; d < 3e1; d /= .7) // Inner loop for wave distortion
//                 p += .3 * sin(p * rotate3D(d, r.xyy) * d + t) / d; // Apply wave distortion using rotate3D
//             z += d = .01 + .4 * max(d = p.y + p.z * .5 + 2., -d * .1); // Update depth based on position
//         }
//         o = tanh((o / vec4(9, 6, 3, 1)) / 2e2); // Scaling
//     } else {
//         // For the rest of the screen, set to black or transparent
//         o = vec4(0.0, 0.0, 0.0, 0.0); // Black with zero opacity
//     }

//     fragColor = o; // Assign final color to fragment
// }

// mod of @XorDev Atlantic - https://x.com/XorDev/status/1922716290545783182
mat3 rotate3D(const in float r, in vec3 a) {
    a = normalize(a);
    float s = sin(r);
    float c = cos(r);
    float oc = 1.0 - c;
    return mat3(oc * a.x * a.x + c, oc * a.x * a.y + a.z * s, oc * a.z * a.x - a.y * s, oc * a.x * a.y - a.z * s, oc * a.y * a.y + c, oc * a.y * a.z + a.x * s, oc * a.z * a.x + a.y * s, oc * a.y * a.z - a.x * s, oc * a.z * a.z + c);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 FC = fragCoord;
    vec2 r = iResolution.xy;
    float t = iTime;
    vec4 o = vec4(0.0, 0.0, 0.0, 1.0);

    // Limit to bottom fifth
    float bottomFifth = r.y * 1.0;
    if(FC.y < bottomFifth) {
        mediump float i, d, z;
        for(i = 0.; i < 40.; i++) {
            vec3 p = z * (vec3(FC, 1.0) * 2. - r.xyy) / r.y;
            for(d = 1.; d < 15.; d /= .7)
                p += .3 * sin(p * rotate3D(d, r.xyy) * d + t) / d;
            z += d = .01 + .4 * max(d = p.y + p.z * .5 + 2., -d * .1);
            o += 1.2 / (d * z);
        }
        o = tanh(o / vec4(9, 6, 3, 1) * 0.005);
    } else {
        o = vec4(0.0, 0.0, 0.0, 0.0);
    }

    fragColor = o;
}