// Digit rendering functions
float PrintDigit(in int n, in vec2 p) {
    // Digit bitmap by P_Malin (https://www.shadertoy.com/view/4sf3RN)
    const int lut[10] = int[10](480599, 139810, 476951, 476999, 71028, 464711, 464727, 476228, 481111, 481095);

    ivec2 xy = ivec2(p * vec2(4, 5));
    int id = 4 * xy.y + xy.x;
    return float((lut[n] >> id) & 1);
}

float PrintInt(const in vec2 uv, in int value) {
    float res = 0.0;
    if(abs(uv.y - 0.5) < 0.5) {
        float maxDigits = (value == 0) ? 1.0 : floor(1.0 + log2(float(value)) / log2(10.0));
        float digitID = floor(uv.x);
        if(digitID >= 0.0 && digitID < maxDigits) {
            float digitVa = mod(floor(float(value) / pow(10.0, maxDigits - 1.0 - digitID)), 10.0);
            res = PrintDigit(int(digitVa), vec2(fract(uv.x), uv.y));
        }
    }
    return res;
}

float PrintIntN(const in vec2 uv, in int value, in int maxDigits) {
    float res = 0.0;
    if(abs(uv.y - 0.5) < 0.5) {
        int digitID = int(floor(uv.x));
        if(digitID >= 0 && digitID < maxDigits) {
            float digitVa = mod(floor(float(value) / pow(10.0, float(maxDigits - 1 - digitID))), 10.0);
            res = PrintDigit(int(digitVa), vec2(fract(uv.x), uv.y));
        }
    }
    return res;
}

// Main shader
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalized pixel coordinates (0 to 1)
    vec2 uv = fragCoord / iResolution.xy;

    // Background color (dark gray)
    vec3 col = vec3(0.2);

    // Fine grid (every 0.02 units)
    vec2 gridFine = fract(uv * 50.0); // 50 lines across each axis
    if(gridFine.x < 0.02 || gridFine.y < 0.02) {
        col = vec3(0.4); // Light gray for fine grid
    }

    // Coarse grid (every 0.1 units)
    vec2 gridCoarse = fract(uv * 10.0); // 10 lines across each axis
    if(gridCoarse.x < 0.03 || gridCoarse.y < 0.03) {
        col = vec3(0.0, 1.0, 0.0); // Green for coarse grid
    }

    // Center crosshair
    if(abs(uv.x - 0.5) < 0.005 || abs(uv.y - 0.5) < 0.005) {
        col = vec3(1.0, 0.0, 0.0); // Red for center
    }

    // Border (viewport edges)
    if(uv.x < 0.01 || uv.x > 0.99 || uv.y < 0.01 || uv.y > 0.99) {
        col = vec3(0.0, 0.0, 1.0); // Blue for edges
    }

    // Add numeric labels for coarse grid lines (0.1 increments)
    float numCol = 0.0;
    for(float i = 0.1; i < 1.0; i += 0.1) {
        // X-axis labels (below the line)
        if(abs(uv.x - i) < 0.05 && uv.y < 0.1) {
            int val = int(i * 10.0); // e.g., 0.1 -> 1, 0.2 -> 2
            vec2 numUV = (uv - vec2(i - 0.03, 0.02)) * 20.0; // Scale and position
            numCol += PrintInt(numUV, val);
        }
        // Y-axis labels (to the left of the line)
        if(abs(uv.y - i) < 0.05 && uv.x < 0.1) {
            int val = int(i * 10.0);
            vec2 numUV = (uv - vec2(0.02, i - 0.03)) * 20.0; // Scale and position
            numCol += PrintInt(numUV, val);
        }
    }

    // Center label (0.5)
    if(abs(uv.x - 0.5) < 0.05 && abs(uv.y - 0.45) < 0.05) {
        vec2 numUV = (uv - vec2(0.47, 0.42)) * 20.0;
        numCol += PrintInt(numUV, 5); // Just "5" for 0.5
    }

    // Blend numbers (white) over the background
    col = mix(col, vec3(1.0), numCol);

    // Output to screen
    fragColor = vec4(col, 1.0);
}