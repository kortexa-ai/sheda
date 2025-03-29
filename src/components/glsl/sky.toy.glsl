// Original shader by Yohei Nishitsuji - https://x.com/YoheiNishitsuji/status/1880399305196073072
float i, e, g, R, s;
vec3 q, p, d = vec3(FC.xy / r - .6, 1);
for(q.zy --;
i ++ < 99.;
) {
e += i / 8e5;
o.rgb += hsv(.6, R + g * .3, e * i / 40.);
s = 4.;
p = q += d * e * R * .2;
g += p.y / s;
p = vec3((R = length(p)) - .5 + sin(t) * .02, exp2(mod(- p.z, s) / R) - .2, p);
for(e = -- p.y;
s < 1e3;
s += s) e += .03 - abs(dot(sin(p.yzx * s), cos(p.xzz * s)) / s * .6);
}