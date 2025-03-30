void mainImage(out vec4 o, vec2 f) {
    vec2 r = iResolution.xy, u = f / r.y;
    float t = iTime, i;
    for(; i++ < 9.; o += sin(u.xyxx * t + i)) u += cos(u * t + i);
    o /= 9.;
}