void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Screen resolution
    vec2 resolution = iResolution.xy;

    // Normalize coordinates
    vec2 uv = fragCoord / resolution;

    // Dynamic pixel size based on time
    float pixelSize = 5.0 + 45.0 * abs(sin(iTime * 0.5));

    // Snap coordinates to pixel grid
    vec2 pixelatedUV = floor(uv * pixelSize) / pixelSize;

    // Clever visualization: Render a colorful grid pattern
    vec3 color = vec3(sin(pixelatedUV.x * 10.0 + iTime), sin(pixelatedUV.y * 10.0 - iTime), cos(pixelatedUV.x * pixelatedUV.y * 20.0));

    // Draw grid lines to emphasize pixel boundaries
    float gridLineWidth = 0.02;
    vec2 grid = fract(uv * pixelSize);
    color *= smoothstep(0.0, gridLineWidth, grid.x) * smoothstep(0.0, gridLineWidth, grid.y);

    // Output the final color
    fragColor = vec4(color, 1.0);
}
