vec2 p = (FC.xy * 2. - r) / r.y, l, v = p * (1. - (l += abs(.7 - dot(p, p)))) / .2;
for(float i;
i ++ < 8.;
o += (sin(v.xyyx) + 1.) * abs(v.x - v.y) * .2) v += cos(v.yx * i + vec2(0, i) + t) / i + .7;
o = tanh(exp(p.y * vec4(1, - 1, - 2, 0)) * exp(- 4. * l.x) / o);