for(float i, d, z = 3.;
i ++ < 1e2;
o += 1.2 / d / z) {
vec3 p = z * (FC.rgb * 2. - r.xyy) / r.y, v = p;
for(d = 1.;
d < 3e1;
d /= .7) p += .3 * sin(p * rotate3D(d, r.xyy) * d + t) / d;
z += d = .01 + .4 * max(d = p.y + p.z * .5 + 2., - d * .1);
}
o = tanh(o / vec4(9, 6, 3, 1) / 2e2);