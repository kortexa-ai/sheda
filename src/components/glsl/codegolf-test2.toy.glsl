void mainImage(out vec4 o, vec2 f) {
    vec2 r = iResolution.xy, u = (f - .5 * r) / r.y;
    float t = iTime;
    u *= mat2(cos(t + vec4(0, 33, 11, 0)));
    o = vec4(fract(u.xy * t), 0, 1);
}