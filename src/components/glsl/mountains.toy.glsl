// Original shader by Yohei Nishitsuji - https://x.com/YoheiNishitsuji/status/1905613345727918534
float i, e, g, R, s;
vec3 q, p, d = vec3(FC.xy / r - .5, 1);
for(q.zy --;
i ++ < 129.;
) {
e += i / 8e5;
o.rgb += hsv(.58, R + g * .3, e * i / 40.);
s = 4.;
p = q += d * e * R * .3 + 2e-5;
g += p.y / s;
p = vec3(log2(R = length(p)) - t * .2, exp2(mod(- p.z, s) / R) - .15, p);
for(e = -- p.y;
s < 1e3;
s += s) e += - abs(dot(sin(p.yzx * s), cos(p.xzy * s)) / s * .5);
}